
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import formidable from 'formidable'
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config( process.env.CLOUDINARY_URL || '' )

type Data = {
  message: string
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return uploadFile( req, res )
    default:
      return res.status(400).json({ message: 'Bad request' })
  }
}

// Save file in file system
const saveFileInFileSystem = ( file: formidable.File ) => {
  const data = fs.readFileSync( file.filepath )
  fs.writeFileSync(`./public/${file.originalFilename}`, data)
  fs.unlinkSync( file.filepath )
  return
}

const saveFile= async ( file: formidable.File ): Promise<string> => {
  const { secure_url } = await cloudinary.uploader.upload( file.filepath )
  return secure_url
}

const parseFiles = async(req: NextApiRequest): Promise<string> => {
  return new Promise( (res, rej) => {
    const form = new formidable.IncomingForm()
    form.parse( req, async( err, fields, files ) => {
      // console.log({ err, fields, files })
      if ( err ) {
        return rej(err)
      }
      const filePath = await saveFile( files.file as formidable.File )
      res(filePath)
    })
  })
}

async function uploadFile(req: NextApiRequest, res: NextApiResponse<Data>) {
  const imageUrl = await parseFiles(req)
  res.status(200).json({ message: imageUrl })
}
