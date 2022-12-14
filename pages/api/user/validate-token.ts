import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import bcrypt from 'bcryptjs'
import { jwt } from '../../../utils'

type Data = 
  | { message: string }
  | { 
      token: string, 
      user : {
        email: string,
        role: string,
        name: string,
      }
    }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  
  switch( req.method ) {
    case 'GET':
      return checkJWT(req, res)
    default:
      return res.status(404).json({
        message: 'Bad request'
      })
  }

}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = '' } = req.cookies;
  
  let userId = ''
  try {
    userId = await jwt.isValidToken(token)
  } catch (e) {
    return res.status(401).json({
      message: 'Token de autorizacion no es valido'
    })
  }

  await db.connect();
  const user = await User.findById( userId ).lean();
  await db.disconnect();

  if ( !user ) {
    return res.status(400).json({ message: 'No exite usuario con ese id' })
  }

  const { _id, role, name, email } = user

  return res.status(200).json({
    // Nuevo JWT
    token: jwt.signToken(_id, email),
    user: {
      email, role, name
    }
  })
} 
