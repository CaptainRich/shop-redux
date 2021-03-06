import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';


// Import the action and context Hook functionality (Not needed for Redux)
//import { useStoreContext } from "../utils/GlobalState";

// Import the helper function to deal with the local (off-line) database.
import { idbPromise } from "../utils/helpers";


import {
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
  UPDATE_PRODUCTS,
} from '../utils/actions';

import { QUERY_PRODUCTS } from "../utils/queries";
import spinner from '../assets/spinner.gif'
import Cart from '../components/Cart';
import { useDispatch, useSelector } from "react-redux";

function Detail() {
  // const { id } = useParams();

  // const [currentProduct, setCurrentProduct] = useState({})

  // const { loading, data } = useQuery(QUERY_PRODUCTS);

  // const products = data?.products || [];

  // useEffect(() => {
  //   if (products.length) {
  //     setCurrentProduct(products.find(product => product._id === id));
  //   }
  // }, [products, id]);

// Not needed for Redux
//const [state, dispatch] = useStoreContext();                 //retrieve the current state from the global object

// For Redux we need to use the selector and dispatch methods.  'useSelector' accepts a single function, which is referred to as the 'selector function'.  The selector function takes the entire Redux store as its argument, reads some value from the state, and returns the result.
const state = useSelector( (state) => state );                 // get the current state

// Get the store's dispatch method
const dispatch = useDispatch();



const { id } = useParams();

const { products, cart } = state;                            // destructure from 'state' for simpler referencing

const [currentProduct, setCurrentProduct] = useState({})     //local state here because "current product" is temporary   
const { loading, data } = useQuery(QUERY_PRODUCTS);


useEffect(() => {

  // Consider data already in the global store
  if (products.length) {
    setCurrentProduct(products.find(product => product._id === id));   // only if there are products in the global state
  } 

  // Or data is retrieved from the server
  else if (data) {
    dispatch({
      type: UPDATE_PRODUCTS,
      products: data.products
    });

    // Need to put this in local DB storage also.
    data.products.forEach((product) => {
      idbPromise('products', 'put', product);
    });    
  }

  // Lastly consider no connection, so retrieve from the local DB
  else if ( !loading ) {
    idbPromise('products', 'get').then((indexedProducts) => {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: indexedProducts
      });
    });
  } 
}, [products, data, loading, dispatch, id]);     // the dependency array


// Function to add items to the shopping cart
const addToCart = () => {
  // Find the cart item with the matching id
  const itemInCart = cart.find((cartItem) => cartItem._id === id);

  // If there was a match, call UPDATE with a new purchase quantity
  if (itemInCart) {
    dispatch({
      type: UPDATE_CART_QUANTITY,
      _id: id,
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
      product: { ...currentProduct, purchaseQuantity: 1 }
    });

    // if the product isn't in the cart yet, add it to the current shopping cart in local storage, IndexedDB
    idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
  }
};


// Function to remove items from the shopping cart.
const removeFromCart = () => {
  dispatch({
    type: REMOVE_FROM_CART,
    _id: currentProduct._id
  });

  // When removing from the cart, delete the item from IndexedDB using the `currentProduct._id` to locate the right item.
  idbPromise('cart', 'delete', { ...currentProduct });

};


/////////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">
            ← Back to Products
          </Link>

          <h2>{currentProduct.name}</h2>

          <p>
            {currentProduct.description}
          </p>

          <p>
            <strong>Price:</strong>
            ${currentProduct.price}
            {" "}
            <button onClick={addToCart}>
              Add to Cart
            </button>
            <button 
              disabled={!cart.find(p => p._id === currentProduct._id)} 
              onClick={removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {
        loading ? <img src={spinner} alt="loading" /> : null
      }
      <Cart />
    </>
  );
};

export default Detail;
