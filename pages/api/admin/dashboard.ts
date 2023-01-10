import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = 
  | { message: string }
  | {
      numberOfOrders: number;
      paidOrders: number;
      noPaidOrders: number;
      numberOfClients: number;
      numberOfProducts: number;
      productsWithNoInventory: number;
      lowInventory: number; // productos con 10 o menos en stock
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


  switch ( req.method ) {
    case 'GET':
      return getDashboard(req, res);
    default: 
      return res.status(400).json({ message: 'Bad request'})
  }
}

async function getDashboard(req: NextApiRequest, res: NextApiResponse<Data>) {
  await db.connect()
  
  const [
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  ] = await Promise.all([
    Order.count(),
    Order.find({ isPaid: true }).count(),
    User.find({ role: 'client' }).count(),
    Product.count(),
    Product.find({ inStock:0 }).count(),
    Product.find({ inStock: { $lte:10 } }).count(),
  ])

  await db.disconnect()


  return res.status(200).json({ 
    numberOfOrders,
    paidOrders,
    noPaidOrders: numberOfOrders - paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
   })
}
