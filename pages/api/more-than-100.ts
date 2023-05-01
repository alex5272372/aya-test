// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await prisma.$executeRaw`
    CREATE TEMP TABLE tmp_dep AS
    SELECT d.id, d.name, e.don_person
    FROM departments AS d
    LEFT JOIN (
      SELECT e1.department_id, (sum(d1.amount) / count(e1.id))::integer AS don_person
      FROM employees AS e1
      LEFT JOIN (
        SELECT employee_id, sum(amount) AS amount
        FROM donations
        GROUP BY employee_id
      ) AS d1
      ON e1.id = d1.employee_id
      GROUP BY e1.department_id
    ) AS e
    ON d.id = e.department_id;
  `

  const data = await prisma.$queryRaw`
    SELECT
      (ROW_NUMBER() OVER())::integer AS num,
      emp.id, emp.name, emp.surname,
      dep.id AS d_id, dep.name AS d_name,
      don.donation::integer,
      (1000000 * don.donation / tdon.total_don
        + CASE WHEN dep.don_person = mdep.max_don THEN 10000 ELSE 0 END)::integer AS reward,
      dep.don_person
    FROM employees AS emp
    LEFT JOIN (
      SELECT employee_id, sum(amount) AS donation
      FROM donations
      GROUP BY employee_id
    ) AS don
    ON emp.id = don.employee_id
    LEFT JOIN (
      SELECT sum(amount) AS total_don
      FROM donations
    ) AS tdon
    ON TRUE
    LEFT JOIN tmp_dep AS dep
    ON emp.department_id = dep.id
    LEFT JOIN (
      SELECT max(don_person) AS max_don
      FROM tmp_dep
    ) AS mdep
    ON TRUE
    WHERE don.donation > 10000
  `
  await prisma.$executeRaw`DROP TABLE tmp_dep;`
  res.status(200).json(data)
}
