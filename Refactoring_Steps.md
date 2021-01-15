Shop-Shop Refactoring
(Richard Ay, January 2021)

This file lists the refactoring steps followed to convert the 'Shop-Shop' application
from a React Context API to a Redux application.



# Refactoring Steps

## 1.0) Import the Redux NPM packages

1.1) Run 'npm install redux react-redux' from the terminal.
1.2) Run 'npm install'


## 2.0) Create the global store and adjust reducers.js

2.1) In \src\utils, create store.js and import 'createStore' from 'redux'.  Export the reducer.
2.2) In \src\reducer.js, remove the 'react' import and the useReducer function.  Initialize the global state and export the reducer.  (Global state can be initialized by copying the code from 'globalState.js', which isn't needed any longer.  Delete globalState.js.)


## 3.0) Adjust 'app.js' to use the Redux store instead of the React Context store.
3.1) Import the (Redux) 'Provider' from 'react-redux.
3.2) Import the Redux store instead of the React GlobalState.
3.3) In the App function, replace 'StoreProvider' with 'Provider store = {store}'


## 4.0) Adjust the files in \pages that deal with 'state' to use rhe Redux state instead of the React GlobalState.

4.1) in 'details.js', import the 'useDispatch' and 'useSelector' methods from 'react-redux'.  Comment out the methods related to React (useStoreContext) and implement Redux methods useSelector and useDispatch.


## 5.0) Adjust the files in \components that deal with 'state' to use rhe Redux state instead of the React GlobalState.

5.1) In \Cart\index.js, import the 'useDispatch' and 'useSelector' methods from 'react-redux'.  Comment out the methods related to React (useStoreContext) and implement Redux methods useSelector and useDispatch.

5.2) In \CartItem\index.js, import the 'useDispatch' method from 'react-redux'. The 'useSelector' methods isn't needed in this function.  Comment out the methods related to React (useStoreContext) and implement Redux methods useSelector and useDispatch.

5.3) In \CategoryMenu\index.js, import the 'useDispatch' and 'useSelector' methods from 'react-redux'.  Comment out the methods related to React (useStoreContext) and implement Redux methods useSelector and useDispatch.

5.4) In \ProductItem\index.js, import the 'useDispatch' and 'useSelector' methods from 'react-redux'.  Comment out the methods related to React (useStoreContext) and implement Redux methods useSelector and useDispatch.

5.4) In \ProductList\index.js, import the 'useDispatch' and 'useSelector' methods from 'react-redux'.  Comment out the methods related to React (useStoreContext) and implement Redux methods useSelector and useDispatch.
