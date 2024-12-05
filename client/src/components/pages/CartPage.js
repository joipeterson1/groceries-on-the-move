import {React, useState, useEffect} from "react";
import NavBar from "../NavBar"
import CartList from "../list/cart/CartList"
import { Link } from "react-router-dom";
import {useHistory} from "react-router-dom"


function CartPage({ profileData, setProfileData, cartData, setCartData }) {
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [error, setError] = useState(null);
  const cartItems = cartData || []
  const totalAmount = cartItems.reduce((total, cartItem) => {
    return total + (cartItem.product.price * cartItem.quantity);
  }, 0);
  
  const history = useHistory();
  console.log('setProfileData:', setProfileData);


  useEffect(() => {
    fetch("/check-session")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Unauthorized');
      })
      .then((data) => {
        if (data) {
          setProfileData(data);  // This should work if setProfileData is correctly passed as a prop
        }
      })
      .catch((error) => {
        console.error("Error during session check:", error);
      });
  }, [setProfileData]);

  // Handle new order
  function NewOrder() {
    if (!profileData) {
      setError("You must be logged in to place an order.");
      return;
    }

    // Prepare order data (cart and customer info)
    const orderData = {
      customer_id: profileData.id,
      products: cartData.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };

    // Make a POST request to create the order
    fetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setOrderConfirmed(true);
        }
      })
      .catch((err) => {
        console.error('Error creating order:', err);
        setError('Failed to create the order. Please try again later.');
      });
  }

  return (
    <div>
      <header>
        <NavBar />
      </header>
      <h2>Your Cart</h2>
      <CartList cart={cartData}/>
      <div>
        <h3>Total: ${totalAmount.toFixed(2)}</h3>
      </div>
      {profileData ? null : (
        <div>
          <Link to="/login">Login/Create your account to order!</Link>
        </div>
      )}

      {profileData && !orderConfirmed && (
        <button onClick={NewOrder}>Order All Items Now!</button>
      )}

      {orderConfirmed && <h2> Your Order has been confirmed!</h2>}

      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default CartPage;
