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

  useEffect(() => {
    fetch('/check-session')
      .then((r) => r.json())
      .then((customer) => 
          setProfileData(customer)
      )
      .catch((error) => {
        console.error('Error fetching products:', error);
        setProfileData({})
      });
  }, []);

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


  useEffect(()=> {
    fetch('/orders')
    .then((r)=> r.json())
    .then((orders)=> 
        setOrders(orders)
    )
    .catch((error) => {
      console.error('Error fetching orders:', error);
      setOrders([]);
    })
  }, [])

  const AddToCart = (product) => {
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

  function onLogout(){
    setProfileData({})
  }

  return(
  <Router>
    <header>
          <NavBar cartData={cartData} profileData={profileData} onLogout={onLogout}/>
    </header>
    <Route path="/" exact render={() => <Home products={products} AddToCart={AddToCart}/>} />
    <Route path="/login" render={() => <LoginSignUp profileData={profileData} setProfileData={setProfileData}/>} />
    <Route path="/cart-page" render={() => <CartPage cartData={cartData} setCartData={setCartData} 
    profileData={profileData} setProfileData={setProfileData} orders={orders} setOrders={setOrders}/>} />
    <Route path="/profile" render={() => <Profile orders={orders} profileData={profileData}/>} />
  </Router>
  )
}

export default App;
