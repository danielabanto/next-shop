import { FC, useReducer, useEffect } from 'react'
import { AuthContext, authReducer } from './'
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined
}

export const AuthProvider:FC = ({ children }) => {
  const [ state, dispatch ] = useReducer(authReducer, AUTH_INITIAL_STATE)
  const router = useRouter()

  const { data, status } = useSession()

  useEffect(() => {
    if ( status === 'authenticated' ) {
      dispatch({ type:'[Auth] - Login', payload: data.user as IUser})
    }
  }, [ data, status ])

  // useEffect(() => {
  //   checkToken()  
  // }, [])

  const checkToken = async() => {
    if ( !Cookies.get('token') ) return

    try{
      const { data } = await tesloApi.get('user/validate-token')
      const { token, user} = data
      Cookies.set('token', token)
      dispatch({ type: '[Auth] - Login', payload: user })
    } catch (err) { 
      Cookies.remove('token')
    }
  }
  

  const loginUser = async( email: string, password: string ): Promise<boolean> => {
    try{
      const { data } = await tesloApi.post('/user/login', { email, password })
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return true
    } catch(err) {
      return false
    }
  }

  const registerUser = async( name: string, email: string, password: string ): 
    Promise<{hasError: boolean; message?: string}> => {
    try{
      const { data } = await tesloApi.post('/user/register', { name, email, password })
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return {
        hasError: false,
      }

    } catch( err ) {
      if ( axios.isAxiosError(err) ) { 
        return {
          hasError: true,
          message: err.response?.data.message
        }
      }
      return {
        hasError: true,
        message: 'No se pudo crear el usuario - intente de nuevo'
      }
    }
  }

  const logout = () => {
    Cookies.remove('cart')
    
    Cookies.remove('firstname') 
    Cookies.remove('lastname') 
    Cookies.remove('address') 
    Cookies.remove('address2') 
    Cookies.remove('zip') 
    Cookies.remove('city') 
    Cookies.remove('country') 
    Cookies.remove('phone') 
    
    signOut()
    
    // Cookies.remove('token')
    // Hard Refresh 
    // router.reload()
  }

  return (
    <AuthContext.Provider value={{ ...state, loginUser, registerUser, logout }}>
      { children }
    </AuthContext.Provider>
  )
}