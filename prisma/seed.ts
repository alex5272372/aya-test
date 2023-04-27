import { PrismaClient } from "@prisma/client"
import * as fs from 'fs'
import { join } from 'path'
import { v1_0 as types } from './data/versions.json'

const prisma = new PrismaClient()

const parse = (
  rows: { rowNum: number, indent: number, text: string }[],
  types: Record<string, unknown>,
  i = { dex: 0 },
  indent = 0
): any[] => {
  const result: any[] = []

  while (i.dex < rows.length) {
    const row = rows[i.dex]

    if (row.indent > indent)
      throw new Error(`Wrong indentation on line ${row.rowNum}`)

    else if (row.indent < indent)
      return result

    else if (row.text.substring(0, 1) === row.text.substring(0, 1).toUpperCase()) {
      if (types[row.text] === undefined)
        throw new Error(`Invalid object name "${row.text}" on line ${row.rowNum}`)
      i.dex++
      result.push([row.text, parse(rows, types[row.text] as Record<string, unknown>, i, indent + 2)])

    } else {
      const prop: string[] = row.text.split(':')
      if (prop.length !== 2)
        throw new Error(`Invalid property format "${row.text}" on line ${row.rowNum}`)
      prop[0] = prop[0].trimEnd()

      if (types[prop[0]] === undefined)
        throw new Error(`Invalid property name "${row.text}" on line ${row.rowNum}`)

      else if (types[prop[0]] === 'number')
        result.push([prop[0], parseInt(prop[1])])
      else if (types[prop[0]] === 'decimal')
        result.push([prop[0], parseFloat(prop[1])])
      else if (types[prop[0]] === 'date')
        result.push([prop[0], new Date(prop[1] + ' UTC')])
      else
        result.push([prop[0], prop[1].trimStart()])

      i.dex++
    }
  }

  return result
}

const getProp = (res: any[], ...names: string[]): any => names.length === 1
? res.filter((el: any) => el[0] === names[0]).map((el: any) => el[1])
: getProp(getProp(res, names[0])[0], ...names.slice(1))

const getOwnProp = (res: any[]): any =>
res.reduce((acc: any, cur: any) => {
  if (!Array.isArray(cur[1])) acc[cur[0]] = cur[1]
  return acc
}, {})

const getAmount = (text: string, rates: any[], date: Date): number => {
  const prop: string[] = text.split(' ').filter((el: string) => el !== '')

  if (prop.length === 1 || prop[1] === 'USD')
    return Math.round(parseFloat(prop[0]) * 100)
  else {
    const rate = rates.filter((r: any) => r.sign === prop[1])
    const rat = rate.filter((r: any) => r.date.getTime() < date)
    return Math.round(parseFloat(prop[0]) * 100 * (rat.length ? rat[0].value : rate[rate.length - 1].value))
  }
}

const main = async () => {
  const rows: { rowNum: number, indent: number, text: string }[] = fs
    .readFileSync(join(process.cwd(), 'prisma', 'data', 'e-list.txt'))
    .toString('utf8')
    .split('\n')
    .map((row, i) => ({
      rowNum: i + 1,
      indent: row.length - row.trimStart().length,
      text: row.trim()
    }))
    .filter(row => row.text !== '')

  const result: any = parse(rows, types)
  const employees = getProp(result, 'E-List', 'Employee')

  const rates = getProp(result, 'Rates', 'Rate')
    .map((el: any) => getOwnProp(el))
    .sort((a: any, b: any) => b.date.getTime() - a.date.getTime())

  const departments = employees.reduce((acc: any, cur: any) => {
    const dep = getOwnProp(getProp(cur, 'Department')[0])
    if (dep && acc.find((el: any) => dep.id === el.id) === undefined) acc.push(dep)
    return acc
  }, [])

  const empls = employees.map((el: any) => {
    const dep = getOwnProp(getProp(el, 'Department')[0])
    const emp = getOwnProp(el)
    emp.departmentId = dep.id
    return emp
  })

  const statements = employees.reduce((acc: any, cur: any) => {
    const emp = getOwnProp(cur)
    getProp(cur, 'Salary', 'Statement').forEach((el: any) => {
      const stm = getOwnProp(el)
      stm.employeeId = emp.id
      stm.amount = getAmount(stm.amount, rates, stm.date)
      acc.push(stm)
    })
    return acc
  }, [])

  const donations = employees.reduce((acc: any, cur: any) => {
    const emp = getOwnProp(cur)
    getProp(cur, 'Donation').forEach((el: any) => {
      const don = getOwnProp(el)
      don.employeeId = emp.id
      don.amount = getAmount(don.amount, rates, don.date)
      acc.push(don)
    })
    return acc
  }, [])

  await prisma.rate.createMany({ data: rates })
  await prisma.department.createMany({ data: departments })
  await prisma.employee.createMany({ data: empls })
  await prisma.statement.createMany({ data: statements })
  await prisma.donation.createMany({ data: donations })
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => await prisma.$disconnect())
