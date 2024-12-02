import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom"; // Use BrowserRouter and Routes
import NavBar from '../NavBar';
import ProductList from '../list/products/ProductList';
import CartPage from '../pages/CartPage';
import Login from '../pages/Login';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  // const history = useHistory();

  console.log(products)

  useEffect(() => {
    fetch('http://127.0.0.1:5555/products')
    .then((r) => r.json())
    .then((products) => setProducts(products))
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/cart')
    .then((r) => r.json())
    .then((cart_items) => setCart(cart_items));
  }, []);

  function AddToCart(product) {
    setCart([...cart, product]);
  }

  const logout = () => {
    setIsLoggedIn(false);
  };


  // useEffect(() => {
  //   if (isLoggedIn) {
  //     history.push('/');
  //   } else {
  //     history.push('/login');
  //   }
  // }, [isLoggedIn, history]);

  // useEffect(() => {
  //   if (isSignedUp) {
  //     history.push('/profile');
  //   } else {
  //     history.push('/login');
  //   }
  // }, [isSignedUp, history]);

  return (
    <div>
      <header>
        <NavBar cart={cart} logout={logout} />
      </header>
      <main>
        <h1>Welcome to Groceries on the Move!</h1>
        <h3>View our Products below.</h3>
        <ProductList products={products} AddToCart={AddToCart}/>
        {/* <Switch> Use Switch instead of Switch */}
          {/* <Route path="/cart"element={<CartPage cart={cart} />} /> */}
          {/* <Route path="/login"element={<Login setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} isSignedUp={isSignedUp} setIsSignedUp={setIsSignedUp} />} /> */}
        {/* </Switch> */}
      </main>
      </div>
  );
}

export default App;
