
import { createContext, useContext } from 'react'
import { ICartProduct } from '../../interfaces'

interface ContextProps {
  cart: ICartProduct[];
  numberOfItems: number;
  subtotal: number;
  tax: number;
  total: number;
  addProductToCart: ( product: ICartProduct) => void
  updateCartQuantity: ( product: ICartProduct ) => void
  removeCartProduct: ( product: ICartProduct ) => void
}

export const CartContext = createContext({} as ContextProps)

export const useCartContext = () => {
  return useContext(CartContext)
}