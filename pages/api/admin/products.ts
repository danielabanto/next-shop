import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'
import { isValidObjectId } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config( process.env.CLOUDINARY_URL || '' )

type Data = 
  | { message: string }
  | IProduct[]
  | IProduct

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts( req, res )
    case 'PUT':
      return updateProduct( req, res )
    case 'POST':
      return createProduct( req, res )
    default:
      return res.status(400).json({ message: 'Bad request' })
  }
}

async function getProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
  await db.connect()
  const products = await Product.find().sort({ title: 'asc' }).lean()
  await db.disconnect()

  const updatedProducts = products.map( product => {
    product.images = product.images.map( img => (
      img.includes('http') ? img : `${ process.env.HOST_NAME}products/${ img }`
    ))
    return product
  })
  
  res.status(200).json( updatedProducts )
}

async function updateProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { _id='', images=[] } = req.body as IProduct
  
  if ( !isValidObjectId(_id) ) {
    return res.status(400).json({ message: 'El id del producto no es valido' })
  }
  if ( images.length < 2 ) {
    return res.status(400).json({ message: 'Es necesario al menos 2 imagenes' })
  }

  //TODO

  try {
    await db.connect()
    const product = await Product.findById(_id)
    if (!product) { 
      await db.disconnect()
      return res.status(400).json({ message: 'No hay producto con ese id' })
    }
    
    product.images.forEach( async(img) => {
      if( !images.includes(img)) { 
        const [ fileId, _extension ] = img.substring( img.lastIndexOf('/') + 1).split('.')
        await cloudinary.uploader.destroy( fileId )
      }
    })

    await product.update( req.body )
    await db.disconnect()

    return res.status(200).json( product )
  } catch (err) {
    await db.disconnect()
    console.error(err)
    await db.disconnect()
    return res.status(400).json({ message: 'Revisar la consola del servidor' })
  }

}

async function createProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { images = [] } = req.body as IProduct
  if ( images.length < 2 ) return res.status(400).json({ message: 'El producto necesita al menos 2 imagenes' })

  try{
    await db.connect()
    // El modelo de mongoosee hace las validaciones
    const productInDB = await Product.findOne({ slug: req.body.slug })
    if ( productInDB ) return res.status(400).json({ message: 'Ya existe un producto con el slug' })
    const product = new Product(req.body)
    await product.save()
    await db.disconnect()
    return res.status(200).json( product )
  } catch(err) {
    console.error(err)
    await db.disconnect()
    return res.status(400).json({ message: 'Revisar logs del servidor' })
  }
}

