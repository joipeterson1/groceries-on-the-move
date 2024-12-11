import {React, useState, useEffect} from "react";
import { Link } from "react-router-dom";

function CartPage({ profileData, setProfileData, cartData, setCartData, orders, setOrders }) {
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [error, setError] = useState(null);
  const totalAmount = cartData.reduce((total, cartItem) => {
    return total + (cartItem.price * cartItem.quantity);
  }, 0);

  console.log(cartData)
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
  }, [setProfileData]);

  function NewOrder() {
    if (!profileData) {
      setError("You must be logged in to place an order.");
      return;
    }
    const orderData = {
      customer_id: profileData.id,
      order_total: totalAmount,
      products: cartData.map(item => ({
        id: item.id,
        price: item.price,
        product_img: item.product_img,
        product_name: item.product_name,
        quantity: item.quantity
      }))
    };
    const products = cartData.map(item => ({
      product: item,
      quantity: item.quantity}))
      console.log(products)

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
          console.log(data)
          setOrderConfirmed(true);
          handleOrder(data)
        }
      })
      .catch((err) => {
        console.error('Error creating order:', err);
        setError('Failed to create the order. Please try again later.');
      });
  }

  const handleRemoveFromCart = (productId) => {
    setCartData((prevCartData) => {
      const product = prevCartData.find(item => item.id === productId);
  
      if (product) {
        if (product.quantity > 1) {
          return prevCartData.map(item =>
            item.id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
        } else {
          return prevCartData.filter(item => item.id !== productId);
        }
      }
      return prevCartData;
    });
  };

function handleOrder(data){
  const newOrders = [...orders, data]
  setOrders(newOrders)
}


  return (
    <div>
      {cartData.length === 0 ? (
    <div>
    <h2>Your Cart is Empty!</h2>
    </div>
    ) : (
    <div>
    <h2>Your Cart</h2>
    {cartData.map((cartItem) => (
      <div key={cartItem.id} className="cart-card">
        <img src={cartItem.product_img} alt={cartItem.product_name} />
        <h3>{cartItem.product_name}</h3>
        <p>${cartItem.price}</p>
        <p>Quantity: {cartItem.quantity}</p>
        <button onClick={() => handleRemoveFromCart(cartItem.id)}>Remove</button>
    </div>
    ))}
    <div>
      <h3>Total: ${totalAmount.toFixed(2)}</h3>
    </div>
    </div>
    )}
      {profileData ? null : (
        <div>
          <Link to="/login">Login/Create your account to order!</Link>
        </div>
      )}

      {profileData && !orderConfirmed && cartData && (
        <button onClick={NewOrder}>Order All Items Now!</button>
      )}

      {orderConfirmed && <h2> Your Order has been confirmed!</h2>}

      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default CartPage;
