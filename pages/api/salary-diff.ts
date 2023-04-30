// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const firstYear = new Date(`${req.query.year}-01-01 UTC`)
  const lastYear = new Date(`${req.query.year}-12-31 UTC`)

  await prisma.$executeRaw`
    CREATE TEMP TABLE tmp_emp AS
    SELECT emp.id, emp.name, emp.surname, emp.department_id,
      (s.amount / s.count)::integer AS annual,
      s.min_salary, s.max_salary, sl.amount AS last_salary
    FROM employees AS emp
    LEFT JOIN (
      SELECT employee_id, sum(amount) AS amount, count(id) AS count,
        min(amount) AS min_salary, max(amount) AS max_salary
      FROM statements
      WHERE date BETWEEN ${firstYear} AND ${lastYear}
      GROUP BY employee_id
    ) AS s
    ON emp.id = s.employee_id
    LEFT JOIN (
      SELECT stat.employee_id, stat.amount
      FROM statements AS stat
      JOIN (
      SELECT employee_id, max(date) AS max_date
      FROM statements
        WHERE date BETWEEN ${firstYear} AND ${lastYear}
      GROUP BY employee_id
      ) AS sld
      ON stat.employee_id = sld.employee_id AND stat.date = sld.max_date
    ) AS sl
    ON emp.id = sl.employee_id;
  `

  const data = await prisma.$queryRaw`SELECT * FROM (
      SELECT
        d.id AS d_id, d.name AS d_name,
        e.id AS e_id, e.name AS e_name, e.surname AS e_surname,
        e.annual, e.min_salary, e.max_salary, e.last_salary,
        ((e.max_salary - e.min_salary) * 10000 / e.min_salary)::integer as percent,
        ed.min_annual, ed.max_annual, ed.max_annual - ed.min_annual AS diff,
        ROW_NUMBER() OVER(
          PARTITION BY d.id
          ORDER BY ((e.max_salary - e.min_salary) * 10000 / e.min_salary) DESC
        )::integer AS row_num
      FROM departments AS d
      LEFT JOIN tmp_emp AS e
      ON d.id = e.department_id
      LEFT JOIN (
        SELECT department_id, min(annual) AS min_annual, max(annual) AS max_annual
        FROM tmp_emp
        GROUP BY department_id
      ) AS ed
      ON d.id = ed.department_id
      ORDER BY ed.max_annual - ed.min_annual DESC, d.id
    ) AS res
    WHERE res.row_num <= 3;`
  await prisma.$executeRaw`DROP TABLE tmp_emp;`

  res.status(200).json(data)
}
