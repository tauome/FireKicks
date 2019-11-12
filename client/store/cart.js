import axios from 'axios'
import history from '../history'

const ADD_TO_CART = 'ADD_TO_CART'
const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
const COMPLETE_ORDER = 'COMPLETE_ORDER'

const initialState = {
  items: [],
  total: 0
}

//Action Creators
export const addToCart = product => ({
  type: ADD_TO_CART,
  product
})

export const removeFromCart = shoe => ({
  type: REMOVE_FROM_CART,
  shoe
})

export const completeOrder = () => ({
  type: COMPLETE_ORDER
})

export const removeFromCartThunk = shoe => {
  return dispatch => {
    dispatch(removeFromCart(shoe))
  }
}

export const addToCartThunk = selectedProduct => {
  return dispatch => {
    dispatch(addToCart(selectedProduct))
  }
}

export const updateStatusThunk = id => {
  return async dispatch => {
    try {
      await axios.put(`/api/users/${id}/order/complete`, {})
      dispatch(completeOrder())
    } catch (error) {
      console.error('ORDER CANNOT BE UPDATED')
    }
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART: {
      let addedItem = action.product
      let duplicate = state.items.find(item => action.product.id === item.id)

      if (duplicate) {
        addedItem.quantity += 1
        return {
          ...state,
          total: state.total + addedItem.price
        }
      } else {
        addedItem.quantity = 1
        let newTotal = state.total + addedItem.price

        return {
          ...state,
          items: [...state.items, addedItem],
          total: newTotal
        }
      }
    }
    case REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items
          .map(
            item =>
              item.id === action.shoe.id
                ? {...item, quantity: item.quantity - 1}
                : item
          )
          .filter(item => item.quantity > 0),
        total: state.total - action.shoe.price
      }

    case COMPLETE_ORDER:
      return initialState
    default:
      return {...state}
  }
}
