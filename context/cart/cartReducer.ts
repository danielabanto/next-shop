
import { ICartProduct } from '../../interfaces'
import { CartState, ShippingAddress } from './'

type CartActionType = 
  | { type: '[Cart] - Update Products in cart', payload: ICartProduct[] }
  | { type: '[Cart] - Load cart from cookies', payload: ICartProduct[] }
  | { type: '[Cart] - Change product quantity', payload: ICartProduct }
  | { type: '[Cart] - Remove product in cart', payload: ICartProduct }
  | { type: '[Cart] - Load Address from Cookies', payload: ShippingAddress }
  | { type: '[Cart] - Update Address', payload: ShippingAddress }
  | { 
      type: '[Cart] - Update order summary', 
      payload: {
        numberOfItems: number;
        subtotal: number;
        tax: number;
        total: number;
      } 
    }

export const cartReducer = ( state: CartState, action: CartActionType ): CartState => {
  switch (action.type) {
    case '[Cart] - Load cart from cookies':
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload]
      }
    case '[Cart] - Update Products in cart':
      return {
        ...state,
        cart: [...action.payload]
      }
    case '[Cart] - Change product quantity':
      return {
        ...state,
        cart: state.cart.map( prod => {
          if (prod._id === action.payload._id && prod.size === action.payload.size) {
            return action.payload
          } else {
            return prod
          }
        })
      }
    case '[Cart] - Remove product in cart':
      return {
        ...state,
        cart: state.cart.filter(prod => !(prod._id === action.payload._id && prod.size === action.payload.size))
      }
    case '[Cart] - Update order summary':
      return {
        ...state,
        ...action.payload
      }
    case '[Cart] - Update Address':
    case '[Cart] - Load Address from Cookies':
      return {
        ...state,
        shippingAddress: action.payload
      }
    default:
      return state
  }
}