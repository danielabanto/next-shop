

import { FC, useReducer, useEffect } from 'react'
import { AuthContext, authReducer } from './'
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';
import Cookies from 'js-cookie';
import axios from 'axios';

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

  useEffect(() => {
    checkToken()  
  }, [])

  const checkToken = async() => {
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

  return (
    <AuthContext.Provider value={{ ...state, loginUser, registerUser }}>
      { children }
    </AuthContext.Provider>
  )
}