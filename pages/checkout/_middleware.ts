import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
// import { jwt } from "../../utils";


export async function middleware( req:NextRequest | any, ev:NextFetchEvent ) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if ( !session ) {
    return NextResponse.redirect(`/auth/login?p=${ req.page.name }`)
  }

  return NextResponse.next()

  // const { token = '' } = req.cookies

  // // return new Response('No autorizado', {
  // //   status: 401,
  // // })

  // try {
  //   await jwt.isValidToken( token )
  //   return NextResponse.next()
  // } catch (err) {
  //   return NextResponse.redirect(`/auth/login?p=${ req.page.name }`)
  // }
}