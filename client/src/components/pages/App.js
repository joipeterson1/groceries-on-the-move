import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch/*, useHistory */} from "react-router-dom";
import NavBar from '../NavBar';
import ProductList from '../list/products/ProductList';
import CartPage from '../pages/CartPage';
import Profile from "./Profile";
import { CartProvider } from "../CartContext";

function App() {
  const [products, setProducts] = useState([]);
  // const [cartData, setCartData] = useState([]);
  // const history = useHistory();
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

  // useEffect(() => {
  //   const storedCartData = JSON.parse(localStorage.getItem('cartData'));
  //   if (storedCartData) {
  //     setCartData(storedCartData);
  //   }
  // }, []); // This runs once when the component mounts
  
  // useEffect(() => {
  //   if (cartData.length > 0) {
  //     localStorage.setItem('cartData', JSON.stringify(cartData)); // Store cart data in localStorage
  //   }
  // }, [cartData]);
      
  // function AddToCart(product) {
  //   if (!profileData) {
  //     alert('Please log in to add items to the cart!');
  //     return;  // Early exit if not logged in
  //   }
  
  //   // Check if product is already in cart
  //   const existingProductIndex = cartData.findIndex(item => item.product.id === product.id);
  
  //   if (existingProductIndex !== -1) {
  //     // Update quantity if product already exists in the cart
  //     const updatedCart = [...cartData];
  //     updatedCart[existingProductIndex].quantity += 1;  // Increment quantity
  //     setCartData(updatedCart);
  //   } else {
  //     // Add new product to cart
  //     const newProduct = { product, quantity: 1 };
  //     setCartData([...cartData, newProduct]);
  //   }
  // }


  return (
    <CartProvider>
    <Router>
      <header>
        <NavBar setProfileData={setProfileData} profileData={profileData}/>
      </header>
      <main>
        <h1>Welcome to Groceries on the Move!</h1>
        <h3>View our Products below.</h3>
       <ProductList products={products}/>
        <Switch>
          <Route exact path="/" render={()=> <ProductList products={products} /*AddToCart={AddToCart}*//>}/>
          <Route 
          path="/cart-page"
            exact render={ () => 
              <CartPage 
                /*setProfileData={setProfileData} 
                profileData={profileData} */
                />}/>
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
      </CartProvider>
  );
}

export default App;
