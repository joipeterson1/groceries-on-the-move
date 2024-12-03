import {React, useState} from "react";
import NavBar from "../NavBar"
import CartList from "../list/cart/CartList"
import { Link } from "react-router-dom";
import {useHistory} from "react-router-dom"


function CartPage({ profileData, cart }) {
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [error, setError] = useState(null);
  const cartItems = cart || [];
  const totalAmount = cartItems.reduce((total, cartItem) => {
    return total + (cartItem.product.price * cartItem.quantity);
  }, 0);
  
  const history = useHistory();

  // Handle new order
  function NewOrder() {
    if (!profileData) {
      setError("You must be logged in to place an order.");
      return;
    }

    // Prepare order data (cart and customer info)
    const orderData = {
      customer_id: profileData.id,
      products: cartItems.map(item => ({
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
      <CartList cart={cartItems}/>
      <div>
        <h3>Total: ${totalAmount.toFixed(2)}</h3>
      </div>
      {!profileData && (
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
