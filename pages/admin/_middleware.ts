import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
// import { jwt } from "../../utils";


export async function middleware( req:NextRequest | any, ev:NextFetchEvent ) {
  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if ( !session ) {
    return NextResponse.redirect(`/auth/login?p=${ req.page.name }`)
  }

  const validRoles = ['admin']

  if ( !validRoles.includes( session.user.role) ) {
    return NextResponse.redirect('/')
  }

  return NextResponse.next()
}