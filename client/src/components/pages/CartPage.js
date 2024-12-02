import {React, useState} from "react";
import NavBar from "../NavBar"
import CartList from "../list/cart/CartList"
import OrderConfirm from "../OrderConfirm"
import { Link } from "react-router-dom";
import {useHistory} from "react-router-dom"


function CartPage({ customer, cart, isLoggedIn }) {
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [error, setError] = useState(null);
  const cartItems = cart || [];
  const totalAmount = cartItems.reduce((total, cartItem) => {
    return total + (cartItem.product.price * cartItem.quantity);
  }, 0);
  
  const history = useHistory();

  // Handle new order
  function NewOrder() {
    if (!isLoggedIn) {
      setError("You must be logged in to place an order.");
      return;
    }

    // Prepare order data (cart and customer info)
    const orderData = {
      customer_id: customer.id,
      products: cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };

    // Make a POST request to create the order
    fetch('http://127.0.0.1:5555/orders', {
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
      {!isLoggedIn && (
        <div>
          <Link to="/login">Login/Create your account to order!</Link>
        </div>
      )}

      {isLoggedIn && !orderConfirmed && (
        <button onClick={NewOrder}>Order All Items Now!</button>
      )}

      {orderConfirmed && <OrderConfirm />}

      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default CartPage;
