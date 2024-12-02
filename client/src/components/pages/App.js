import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom"; // Use BrowserRouter and Routes
import NavBar from '../NavBar';
import ProductList from '../list/products/ProductList';
// import CartPage from '../pages/CartPage';
import Login from '../pages/Login';
import { Link } from "react-router-dom";

function App() {
  const [products, setProducts] = useState([]);
  // const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [customer, setCustomer] = useState(null)
  const history = useHistory();

  useEffect(()=> {
    fetch('http://127.0.0.1:5555/check-session')
  .then((r) => {
    if (!r.ok) {
      throw new Error('Network response was not ok');
    }
    return r.json().catch(() => ({})); // If json parsing fails, return an empty object
  })
  .then((customer) => {
    if (customer) {
      setCustomer(customer);
    }
  })
  .catch((error) => {
    console.error('Fetch error: ', error);
  });
}, [])
  
  useEffect(() => {
    fetch('http://127.0.0.1:5555/products')
    .then((r) => r.json())
    .then((products) => setProducts(products))
  }, []);


  // useEffect(() => {
  //   fetch('http://127.0.0.1:5555/cart')
  //   .then((r) => r.json())
  //   .then((cart_items) => setCart(cart_items));
  // }, []);

  // function AddToCart(product) {
  //   setCart([...cart, product]);
  // }


  function onLogin(customerData){
    setCustomer(customerData)
    setIsLoggedIn(true)
    setIsSignedUp(true)
  }

  function onLogout(){
    setCustomer(null)
    setIsLoggedIn(false)
  }


  // useEffect(() => {
  //   if (isLoggedIn) {
  //     history.push('/');
  //   } else {
  //     history.push('/login');
  //   }
  // }, [isLoggedIn, history]);


  return (
    <Router>
      <header>
        {isLoggedIn ? 
        (<div>
          <h2>Welcome back, {customer.name}! </h2> 
        </div>) : null}
        <NavBar /*cart={cart}*/ onLogout={onLogout}/>
      </header>
      <main>
        <h1>Welcome to Groceries on the Move!</h1>
        <h3>View our Products below.</h3>
       <ProductList products={products} /*AddToCart={AddToCart}*//>
        <Switch>
          {/* <Route path="/cart"element={<CartPage cart={cart} />} /> */}
          <Route path="/login" render={() => (
            <Login
              onLogin={onLogin}
              isLoggedIn={isLoggedIn}
              isSignedUp={isSignedUp}
              setIsSignedUp={setIsSignedUp}
              />
          )} />
        </Switch>
      </main>
      </Router>
  );
}

export default App;
