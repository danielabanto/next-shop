import { FC, useEffect, useReducer } from 'react'
import Cookie from 'js-cookie'
import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces'
import { CartContext, cartReducer } from './'
import { tesloApi } from '../../api';
import axios from 'axios';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[]
  numberOfItems: number;
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
}


const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subtotal: 0,
  tax: 0,
  total:0,
  shippingAddress: undefined
}

export const CartProvider:FC = ({ children }) => {
  const [ state, dispatch ] = useReducer(cartReducer, CART_INITIAL_STATE)

  useEffect(() => {
    // Por si se manipula la cookie
    try{
      const cart = JSON.parse(Cookie.get('cart') || '[]')
      dispatch({ type: '[Cart] - Load cart from cookies', payload: cart })
    } catch(e) {
      dispatch({ type: '[Cart] - Load cart from cookies', payload: [] })
    }
  }, [])

  useEffect(()=> {
    if ( Cookie.get('firstname') ) {
      const shippingAddress = {
        firstname : Cookie.get('firstname') || '',
        lastname  : Cookie.get('lastname') || '',
        address   : Cookie.get('address') || '',
        address2  : Cookie.get('address2') || '',
        zip       : Cookie.get('zip') || '',
        city      : Cookie.get('city') || '',
        country   : Cookie.get('country') || '',
        phone     : Cookie.get('phone') || '',
      }
      dispatch({type: '[Cart] - Load Address from Cookies', payload: shippingAddress})
    }
  }, [])

  useEffect(() => {
    Cookie.set('cart', JSON.stringify(state.cart))
  }, [state.cart])

  useEffect(() => {
    const subtotal = state.cart.reduce( (prev, curr) => curr.price * curr.quantity + prev, 0)
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE) || 0
    const orderSummary = {
      numberOfItems: state.cart.reduce( (prev, curr) => curr.quantity + prev , 0),
      subtotal,
      tax: subtotal * taxRate,
      total: subtotal * ( taxRate + 1 )
    }
    dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })
  }, [state.cart])

  const addProductToCart = (product: ICartProduct) => {
    let cart= [...state.cart]
    const index = cart.findIndex((el) => el._id === product._id && el.size === product.size)
    if (index < 0) {
      cart = [...cart, product]
    } else {
      cart[index] = {...cart[index], quantity: cart[index].quantity + product.quantity}
    }
    dispatch({type:'[Cart] - Update Products in cart', payload: cart})
  }

  const updateCartQuantity = ( product: ICartProduct ) => {
    dispatch({ type: '[Cart] - Change product quantity', payload: product})
  }

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Remove product in cart', payload: product })
  }

  const updateAddress = (data: ShippingAddress) => {
    Cookie.set('firstname',data.firstname) 
    Cookie.set('lastname',data.lastname) 
    Cookie.set('address',data.address) 
    Cookie.set('address2',data.address2 || '') 
    Cookie.set('zip',data.zip) 
    Cookie.set('city',data.city) 
    Cookie.set('country',data.country) 
    Cookie.set('phone',data.phone) 
    dispatch({type:'[Cart] - Update Address', payload: data})
  }

  const createOrder = async () :Promise<{ hasError: boolean; message: string }> => {
    if ( !state.shippingAddress) {
      throw new Error('No hay direccion de entrega')
    }

    const body: IOrder = {
      orderItems: state.cart.map( p => ({
        ...p,
        size: p.size!
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subtotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    }

    try{
      const { data } = await tesloApi.post<IOrder>('/orders', body)
      dispatch({ type:'[Cart] - order complete' })
      return {
        hasError: false,
        message: data._id!
      }
    } catch(err) {
      if (axios.isAxiosError(err)) {
        return{
          hasError: true,
          message: err.response?.data.message
        }
      }
      return {
        hasError: true,
        message: 'Error no controlado, hable con el administrador'
      }
    }
  }

  return (
    <CartContext.Provider 
      value={{
        ...state, 
        addProductToCart, 
        updateCartQuantity, 
        removeCartProduct,
        updateAddress,
        createOrder
      }}
    >
      { children }
    </CartContext.Provider>
  )
}