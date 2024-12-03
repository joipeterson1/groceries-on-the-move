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


  useEffect(() => {
    if (profileData) {
      fetch('/cart')
        .then((r) => r.json())
        .then((cart) => {
          if (cart && Array.isArray(cart.items)) {
            setCartData(cart.items); // Assuming cart contains items
          } else{
            setCartData([])
          }
        })
        .catch((error) => console.error("Error fetching cart data", error));
    }
  }, [profileData])

  function AddToCart(item) {
    if (!Array.isArray(cartData)) {
      console.error("cartData is not an array:", cartData);
      return;
    }

    const existingItem = cartData.find(cartItem => cartItem.product_id === item.product_id);
    
    if (existingItem) {
      // If the item exists, update the quantity
      const updatedCart = cartData.map(cartItem =>
        cartItem.product_id === item.product_id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      
      // Update the state
      setCartData(updatedCart);
      
      // Send a PATCH request to the server to update the cart
      fetch('/cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: item.product_id,
          quantity: existingItem.quantity + 1,
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update the cart');
        }
        return response.json();
      })
      .then(updatedCartData => {
        console.log('Cart updated:', updatedCartData);
      })
      .catch(error => {
        console.error('Error updating cart:', error);
      });
    } else {
      // If the item doesn't exist, add it to the cart
      const newItem = { ...item, quantity: 1 };
      const updatedCart = [...cartData, newItem];
      
      // Update the state
      setCartData(updatedCart);
      
      // Send a POST request to the server to add the new item to the cart
      fetch('/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: item.product_id,
          quantity: 1,
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add the item to the cart');
        }
        return response.json();
      })
      .then(newCartData => {
        console.log('Item added to cart:', newCartData);
      })
      .catch(error => {
        console.error('Error adding item to cart:', error);
      });
    }
  }
  

  function onLogout() {
    profileData(null);
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
        {profileData ? 
        (<div>
          <h2>Welcome back! </h2> 
        </div>) : null}
        <NavBar cart={cartData} onLogout={onLogout} profileData={profileData}/>
      </header>
      <main>
        <h1>Welcome to Groceries on the Move!</h1>
        <h3>View our Products below.</h3>
       <ProductList products={products} AddToCart={AddToCart}/>
        <Switch>
          <Route path="/cart"render={ () => (<CartPage profileData={profileData} cart={cartData}/>)} />
          <Route path="/login" render={() => (<Login/>)} />
          <Route 
            path="/profile" 
            render={() => (
              <Profile 
                setProfileData={setProfileData} 
                profileData={profileData} 
                orders={orders} 
                setOrders={setOrders} 
              />
            )} 
          />
        </Switch>
      </main>
      </Router>
  );
}

export default App;
