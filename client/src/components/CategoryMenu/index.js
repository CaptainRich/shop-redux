import React, { useEffect } from 'react';
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_CATEGORIES } from "../../utils/queries";

// Import the 'global state' hook.
//import { useStoreContext } from '../../utils/GlobalState';      // Switch from React Context to
import { useDispatch, useSelector } from "react-redux";           // Redux

// Import the helper function to deal with the local (off-line) database.
import { idbPromise } from "../../utils/helpers";



//function CategoryMenu({ setCategory }) {
function CategoryMenu({  }) {  

  // Setup the hooks for the 'global state'.
  // const [state, dispatch] = useStoreContext();   // establish a 'state' variable from the global store.

  // For Redux we need to use the selector and dispatch methods.  'useSelector' accepts a single function, which is referred to as the 'selector function'.  The selector function takes the entire Redux store as its argument, reads some value from the state, and returns the result.
  const state = useSelector( state => state );                 // get the current state

  // Get the store's dispatch method
  const dispatch = useDispatch();

  const { categories } = state;                                         //need to only destructure 'categories' here
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);   //get the categories

  
  useEffect(() => {
    // If categoryData exists or has changed from the response of useQuery, then run dispatch()
    if (categoryData) {
      // Execute our dispatch function with our action object indicating the type of action and the data to set our state for categories to.  This sends the category data to the global state.
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });

      // Also take each category and save it to IndexedDB using the helper function 
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    }
    // Handle the possibility that 'loading' is undefined, i.e. no connection to the server  
    else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories
        });
      });
    }
  }, [categoryData, loading, dispatch]);

// Update the click handler to update the global state instead of using the function received as a 'prop' from the 
// 'Home' component.
const handleClick = id => {
  dispatch({
    type: UPDATE_CURRENT_CATEGORY,
    currentCategory: id
  });
};

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map(item => (
        <button
          key={item._id}
          onClick={() => {
            //setCategory(item._id);
            handleClick( item._id );
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
