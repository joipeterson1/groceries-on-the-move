import {React, useState, useEffect} from "react";
import NavBar from "../NavBar"
import { Link } from "react-router-dom";
// import {useHistory} from "react-router-dom"
import {useCart} from "../CartContext"


function CartPage(/*{cartData}*/) {
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const { cartData, totalItems, removeFromCart } = useCart();
  const cartItems = cartData || []
  const totalAmount = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  
  // const history = useHistory();

  console.log('cartData:', cartData);

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
      {/* <header>
        <NavBar />
      </header> */}
      <div>
      <h2>Your Cart</h2>
      {cartData.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div>
          {cartData.map((item) => (
            <div key={item.product.id}>
              <h3>{item.product.product_name}</h3>
              <p>${item.product.price} x {item.quantity}</p>
              <button onClick={() => removeFromCart(item.product.id)}>Remove</button>
            </div>
          ))}
          <h3>Total: ${totalAmount.toFixed(2)}</h3>
        </div>
      )}
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
