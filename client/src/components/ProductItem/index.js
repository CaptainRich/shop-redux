import React from "react";
import { Link } from "react-router-dom";
import { pluralize } from "../../utils/helpers"

// To maintain the global 'store'.
//import { useStoreContext } from '../../utils/GlobalState';      // Switch from React Context to
import { useDispatch, useSelector } from "react-redux";           // Redux

import { ADD_TO_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';

// Import the helper function to deal with the local (off-line) database.
import { idbPromise } from "../../utils/helpers";


function ProductItem(item) {
  const {
    image,
    name,
    _id,
    price,
    quantity
  } = item;

  
  // const [state, dispatch] = useStoreContext();   // establish a 'state' variable from the global store.
  
  // For Redux we need to use the selector and dispatch methods.  'useSelector' accepts a single function, which is referred to as the 'selector function'.  The selector function takes the entire Redux store as its argument, reads some value from the state, and returns the result.
  const state = useSelector( state => state );                 // get the current state

  // Get the store's dispatch method
  const dispatch = useDispatch();

  const { cart } = state;



// Function to add items to the shopping cart
  const addToCart = () => {
    // Find the cart item with the matching id
    const itemInCart = cart.find((cartItem) => cartItem._id === _id);

    // If there was a match, call UPDATE with a new purchase quantity
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: _id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });

      // If updating a quantity, use the existing item data and increment purchaseQuantity value by one in local storage.
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });        

    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...item, purchaseQuantity: 1 }
      });
      
      // if the product isn't in the cart yet, add it to the current shopping cart in local storage, IndexedDB
      idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });
    }
  };


  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
}

export default ProductItem;
