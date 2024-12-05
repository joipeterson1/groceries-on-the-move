import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import NavBar from '../NavBar';
import ProductList from '../list/products/ProductList';
import CartPage from '../pages/CartPage';
import Login from '../pages/Login';
import Profile from "./Profile";

function App() {
  const [products, setProducts] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [customer, setCustomer] = useState(null)
  const history = useHistory();
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/check-session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Unauthorized');
      })
      .then((data) => {
        if (data) {
          setProfileData(data);

          return fetch("/orders", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
        }
      })
      .then((response) => response.json()) 
      .then((orderData) => {
          setOrders(orderData || []);
      })
      .catch((error) => {
        console.error('Error during session check or fetching data:', error);
      });
  }, []);
  
  useEffect(() => {
    fetch('/products')
    .then((r) => r.json())
    .then((products) => setProducts(products))
  }, []); 
      
  function AddToCart(product) {
    if (profileData){
      if (cartData){
        setCartData([...cartData, product])
      } else {
        setCartData(product)
      }
    } else {
      return <h4> Please Login!</h4>
    }
      }

  function onLogout() {
    setProfileData(null);
    setCartData([]);
    fetch('/logout', { method: 'DELETE' })
      .then(() => {
        history.push('/');
      })
      .catch((error) => console.error('Logout failed', error));
  }

  return (
    <Router>
      <header>
        <NavBar cart={cartData} onLogout={onLogout} profileData={profileData}/>
      </header>
      <main>
        <h1>Welcome to Groceries on the Move!</h1>
        <h3>View our Products below.</h3>
       <ProductList products={products} AddToCart={AddToCart}/>
        <Switch>
          <Route 
          path="/cart-page"
            render={ () => (
              <CartPage 
                setProfileData={setProfileData} 
                profileData={profileData} 
                setCartData={setCartData} 
                cartData={cartData}/>)} />
          <Route 
            path="/profile" 
            render={() => (
              <Profile 
                setProfileData={setProfileData} 
                profileData={profileData} 
                orders={orders} 
                setOrders={setOrders} />
            )} 
          />
        </Switch>
      </main>
      </Router>
  );
}

export default App;
