// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parts = (req.query.month as string).split('-').map((el: string) => parseInt(el))

  const firstMonth = new Date(parts[1] > 5
    ? `${parts[0]}-${('0' + (parts[1] - 5)).slice(-2)} UTC`
    : `${parts[0] - 1}-${('0' + (parts[1] + 7)).slice(-2)} UTC`)
  const lastMonth = new Date(new Date(parts[1] === 12
    ? `${parts[0] + 1}-01 UTC`
    : `${parts[0]}-${('0' + (parts[1] + 1)).slice(-2)} UTC`)
    .getTime() - 1000 * 60 * 60 * 24)
  
  const firstYear = new Date(`${req.query.year}-01-01 UTC`)
  const lastYear = new Date(`${req.query.year}-12-31 UTC`)

  const data = await prisma.$queryRaw`
    SELECT
      e.id, e.name, e.surname,
      (sm.amount / sm.count)::integer AS monthly,
	    (sy.amount / sy.count)::integer AS annual,
      d.amount::integer AS donation,
      (d.amount * 10000 / (sm.amount / sm.count))::integer AS percent
    FROM employees AS e
    LEFT JOIN (
      SELECT employee_id, sum(amount) AS amount
      FROM donations
      GROUP BY employee_id) AS d
    ON e.id = d.employee_id
    LEFT JOIN (
      SELECT employee_id, sum(amount) AS amount, count(id) AS count
      FROM statements
      WHERE date BETWEEN ${firstMonth} AND ${lastMonth}
      GROUP BY employee_id) AS sm
    ON e.id = sm.employee_id
    LEFT JOIN (
      SELECT employee_id, sum(amount) AS amount, count(id) AS count
      FROM statements
      WHERE date BETWEEN ${firstYear} AND ${lastYear}
      GROUP BY employee_id) AS sy
    ON e.id = sy.employee_id
    WHERE d.amount > sm.amount / sm.count / 10
    ORDER BY sy.amount / sy.count;
  `
  res.status(200).json(data)
}
