
import { createContext, useContext } from 'react'
import { ICartProduct, ShippingAddress } from '../../interfaces';

interface ContextProps {
  isLoaded: boolean,
  cart: ICartProduct[];
  numberOfItems: number;
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;

  addProductToCart: ( product: ICartProduct) => void
  updateCartQuantity: ( product: ICartProduct ) => void
  removeCartProduct: ( product: ICartProduct ) => void
  updateAddress: (data: ShippingAddress) => void

  createOrder: () => Promise<{ hasError: boolean; message: string }>
}

export const CartContext = createContext({} as ContextProps)

export const useCartContext = () => {
  return useContext(CartContext)
}