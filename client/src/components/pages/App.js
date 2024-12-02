import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import NavBar from '../NavBar';
import ProductList from '../list/products/ProductList';
import CartPage from '../pages/CartPage';
import Login from '../pages/Login';
import Profile from "./Profile";
import { Link } from "react-router-dom";

function App() {
  const [products, setProducts] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customer, setCustomer] = useState(null)
  const history = useHistory();

  useEffect(()=> {
    fetch('/check-session')
  .then((r) => {
    if (!r.ok) {
      throw new Error('Network response was not ok');
    }
    return r.json().catch(() => ({}));
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
    fetch('/products')
    .then((r) => r.json())
    .then((products) => setProducts(products))
  }, []);


  useEffect(() => {
    if (isLoggedIn && customer) {
      fetch('/cart')
        .then((r) => r.json())
        .then((cart) => {
          if (cart) {
            setCartData(cart.items); // Assuming cart contains items
          }
        })
        .catch((error) => console.error("Error fetching cart data", error));
    }
  }, [isLoggedIn, customer])

   // Add to cart function (optimizing cart state update)
   function AddToCart(item) {
    const existingItem = cartData.find(cartItem => cartItem.product_id === item.product_id);
    if (existingItem) {
      // If item already in cart, update quantity
      const updatedCart = cartData.map(cartItem =>
        cartItem.product_id === item.product_id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCartData(updatedCart);
    } else {
      // Otherwise add new item to cart
      setCartData([...cartData, { ...item, quantity: 1 }]);
    }
  }

  // Update cart on change
  useEffect(() => {
    if (cartData.length > 0) {
      fetch('/cart', {
        method: 'POST',
        body: JSON.stringify({ items: cartData }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((r) => {
          if (!r.ok) {
            throw new Error('Error updating cart');
          }
        })
        .catch((error) => console.error("Error updating cart", error));
    }
  }, [cartData]);

  function onLogout() {
    setIsLoggedIn(false);
    setCartData([]);
    fetch('/logout', { method: 'DELETE' })
      .then(() => {
        history.push('/login');
      })
      .catch((error) => console.error('Logout failed', error));
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
        <NavBar cart={cartData} onLogout={onLogout}/>
      </header>
      <main>
        <h1>Welcome to Groceries on the Move!</h1>
        <h3>View our Products below.</h3>
       <ProductList products={products} AddToCart={AddToCart}/>
        <Switch>
          <Route path="/cart"render={ () => (<CartPage customer={customer} cart={cartData} isLoggedIn={isLoggedIn}/>)} />
          <Route path="/login" render={() => (
            <Login
              customer={customer}
              setCustomer={setCustomer}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              />
          )} />
          <Route path="/profile" render= {()=> (<Profile customer={customer} setCustomer={setCustomer} setIsLoggedIn={setIsLoggedIn}/>)} />
        </Switch>
      </main>
      </Router>
  );
}

export default App;
