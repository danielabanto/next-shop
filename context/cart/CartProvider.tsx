

import { FC, useEffect, useReducer } from 'react'
import Cookie from 'js-cookie'
import { ICartProduct } from '../../interfaces'
import { CartContext, cartReducer } from './'

export interface CartState {
  cart: ICartProduct[]
  numberOfItems: number;
  subtotal: number;
  tax: number;
  total: number;
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
  numberOfItems: 0,
  subtotal: 0,
  tax: 0,
  total:0
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

  return (
    <CartContext.Provider value={ {...state, addProductToCart, updateCartQuantity, removeCartProduct} }>
      { children }
    </CartContext.Provider>
  )
}