import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Route} from "react-router-dom";
import NavBar from '../NavBar';
import CartPage from './CartPage';
import Home from "./Home"
import Profile from "./Profile"
import LoginSignUp from "./LoginSignUp"

function App() {
  const [products, setProducts] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [orders, setOrders] = useState([]);

  const sessionCheck = () => {
    fetch("/check-session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        setProfileData(data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  useEffect(() => {
    fetch('/products')
      .then((r) => r.json())
      .then((products) => 
          setProducts(products)
      )
      .catch((error) => {
        console.error('Error fetching products:', error);
        setProducts([])
      });
  }, []);


  const AddToCart = (product) => {
    sessionCheck()
    setCartData((prevCartData) => {
      const productExists = prevCartData.find(item => item.id === product.id);

      if (productExists) {
        return prevCartData.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCartData, { ...product, quantity: 1 }];
      }
    });
  }

  const fetchOrders = () => {
    fetch("/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        setOrders(data); 
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  const onLogout = () => {
    fetch("/check-session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        setProfileData(data);
        fetchOrders()
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  function onDelete(deletedOrder){
    const updatedOrders = orders.filter((order)=> order.id !== deletedOrder.id)
    setOrders(updatedOrders)
  }

  function onEdit(updatedOrder){
    const newOrder = orders.map((order)=> {
      if (order.id === updatedOrder.id) {
        return updatedOrder
      } else {
        return order
      }
    })
    setOrders(newOrder)
  }

  return(
  <Router>
    <header>
          <NavBar sessionCheck={sessionCheck} fetchOrders={fetchOrders} setProfileData={setProfileData} cartData={cartData} onLogout={onLogout}/>
    </header>
    <Route path="/" exact render={() => <Home products={products} AddToCart={AddToCart}/>} />
    <Route path="/login" render={() => <LoginSignUp profileData={profileData} setProfileData={setProfileData}/>} />
    <Route path="/cart-page" render={() => <CartPage cartData={cartData} setCartData={setCartData} 
    profileData={profileData} setProfileData={setProfileData} orders={orders} setOrders={setOrders}/>} />
    <Route path="/profile" render={() => <Profile setOrders={setOrders} orders={orders} 
    profileData={profileData} setProfileData={setProfileData} onDelete={onDelete} onEdit={onEdit} fetchOrders={fetchOrders}/>} />
  </Router>
  )
}

export default App;
