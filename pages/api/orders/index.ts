import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { db } from '../../../database'
import { IOrder } from '../../../interfaces'
import { Order, Product } from '../../../models'

type Data = 
  | { message: string }
  | IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return createOrder(req, res)
    default:
      return res.status(400).json({ message: 'Bad request' })
  }
}

async function createOrder(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { orderItems, total } = req.body as IOrder;
  
  // Verificar sesion de usuario
  // En los middlewares es recomendado usar el getToken en lugar del getSession
  const session = await getSession({ req })
  if ( !session ) { 
    return res.status(401).json({ message: 'Debe de estar autenticado' })
  }

  // Crear arreglo con productos que se quiere
  const productsIds = orderItems.map( p => p._id )
  await db.connect()
  // $in significa exista en
  const dbProducts = await Product.find({ _id: {$in: productsIds} })

  try{
    const subTotal = orderItems.reduce( ( prev, curr ) => {
      const currentPrice = dbProducts.find ( prod => prod.id === curr._id )?.price
      if (!currentPrice) { 
        throw new Error('Verifique el carrito de nuevo, producto no existe')
      }
      return (currentPrice * curr.quantity) + prev
    }, 0)

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backendTotal = subTotal * (taxRate + 1)
    if (total !== backendTotal) {
      throw new Error('El total no cuadra con el monto')
    }
    console.log({ session })
    const user : any = session.user
    console.log({user})
    const { _id: userId } = user || {}
    if( !userId ) {
      throw new Error('El usuario no esta autenticado')
    }
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId})
    newOrder.total = Math.round( newOrder.total * 100) / 100
    await newOrder.save()

    return res.status(201).json( newOrder )

  } catch( err:any ) {
    await db.disconnect()
    res.status(400).json({
      message: err.message || 'Revise logs del servidor'
    })
    console.log(err)
  }
  
  await db.disconnect()
}
