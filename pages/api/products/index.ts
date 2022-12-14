import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'

type Data = 
 | { message: string }
 | IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch(req.method) {
    case 'GET':
      return getProducts( req, res )
      default:
        return res.status(400).json({
          message: 'Bad request'
        })

  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  
  const { gender='all' } = req.query
  let condition = {}
  if ( gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`) ) {
    condition = { gender } 
  }

  await db.connect()
  // Con el metodo lean, trae lo necesario de la data sin agregarle metodos
  // Select para seleccionar los campos que se envia, el menos (-) quita por ejemplo el _id
  const products = await Product.find(condition).select('title images price inStock slug -_id').lean()

  await db.disconnect()
  return res.status(200).json( products )

}
