import { PrismaClient } from "@prisma/client"
import * as fs from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

const setResult = (result: Record<string, unknown> | Record<string, unknown>[], name: string, value: any) => {
  if (Array.isArray(result))
    result.push({ [name]: value })

  else if (result[name] === undefined)
    result[name] = value
    
  else {
    result = Object.keys(result).map(key => ({ [key]: (result as Record<string, unknown>)[key] }))
    result.push({ [name]: value })
  }

  return result
}

const parse = (
  rows: { rowNum: number, indent: number, text: string }[],
  types: Record<string, unknown>,
  i = { dex: 0 },
  indent = 0
) => {
  let result: Record<string, unknown> | Record<string, unknown>[] = {}

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
      result = setResult(result, row.text, parse(rows, types[row.text] as Record<string, unknown>, i, indent + 2))

    } else {
      const prop: string[] = row.text.split(':')
      if (prop.length !== 2)
        throw new Error(`Invalid property format "${row.text}" on line ${row.rowNum}`)
      prop[0] = prop[0].trimEnd()

      if (types[prop[0]] === undefined)
        throw new Error(`Invalid property name "${row.text}" on line ${row.rowNum}`)

      else if (types[prop[0]] === 'number')
        result = setResult(result, prop[0], parseInt(prop[1]))

      else if (types[prop[0]] === 'decimal')
        result = setResult(result, prop[0], parseFloat(prop[1]))

      else if (types[prop[0]] === 'date')
        result = setResult(result, prop[0], new Date (prop[1]))
        
      else
        result = setResult(result, prop[0], prop[1].trimStart())
      
      i.dex++
    }
  }

  return result
}

const main = async () => {
  const types: Record<string, unknown> = {
    'E-List': {
      Employee: {
        id: 'number',
        name: 'string',
        surname: 'string',
        Department: {
          id: 'number',
          name: 'string'
        },
        Salary: {
          Statement: {
            id: 'number',
            amount: 'money',
            date: 'date'
          }
        },
        Donation: {
          id: 'number',
          date: 'date',
          amount: 'money'
        }
      }
    },
    Rates: {
      Rate: {
        date: 'date',
        sign: 'string',
        value: 'decimal'
      }
    }
  }

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

  const result = parse(rows, types)
  console.log(result) // TODO
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => await prisma.$disconnect())
