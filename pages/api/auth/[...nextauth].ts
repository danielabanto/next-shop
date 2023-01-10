import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import jwt from 'jsonwebtoken';
import { dbUsers } from "../../../database";
import { signIn } from 'next-auth/react';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com' },
        password: { label: 'Contrasena:', type: 'password', placeholder: 'Contrasena' },
      },
      async authorize(credentials) {
        // console.log('1 ', { credentials })
        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
        // Que retorne nulo significa no autorizado
      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    
    // ...add more providers here
  ],

  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  session: {
    // strategy: "jwt",
    maxAge: 2592000, // 30dias
    updateAge: 86400, // cada dia
  },

  callbacks: {
    async jwt({ token, account, user }: any) {
        // console.log('2 ', { token, account, user })
      if ( account ) {
         token.accessToken = account.access_token
         switch( account.type ) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '' );
            // console.log('user!!!!:', token.user )
          case 'credentials':
            token.user = user
          break
         }
      }
      return token;
    },
    async session({ session, token, user }: any) {
      // console.log('3 ', { session, token, user })
      session.accessToken = token.accessToken
      session.user = token.user;
      return session
    }
  }
}

export default NextAuth(authOptions);
