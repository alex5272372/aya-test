
import nextConnect from 'next-connect'
import multer from 'multer'
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { parseVersion } from '../../helpers'

const upload = multer()
const prisma = new PrismaClient()

const apiRoute = nextConnect({
  onError(error: Error, req: NextApiRequest, res: NextApiResponse) {
    res.status(501).json({ message: `Sorry something Happened! ${error.message}` })
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ message: `Method '${req.method}' Not Allowed` })
  }
})

apiRoute.use(upload.single('file'))

apiRoute.post(async (req: any, res: NextApiResponse) => {
  await parseVersion(req.file.buffer, prisma)
  res.status(200).json({ message: 'success' })
})

export default apiRoute

export const config = {
  api: {
    bodyParser: false // Disallow body parsing, consume as stream
  }
}
