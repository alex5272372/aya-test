import { PrismaClient } from '@prisma/client'
import { parseVersion } from '../helpers'
import fs from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

const main = async () => {
  const file = fs.readFileSync(join(process.cwd(), 'prisma', 'data', 'e-list.txt'))
  await parseVersion(file, prisma)
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => await prisma.$disconnect())
