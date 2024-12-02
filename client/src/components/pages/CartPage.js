import React from "react";
import NavBar from "../NavBar"
import CartList from "../list/cart/CartList"


function CartPage({ cart }) {
  if (cart.length === 0) {
    return <h2>Your cart is empty.</h2>;
  }

  return (
    <div>
      <header>
        <NavBar />
      </header>
      <h2>Your Cart</h2>
      <CartList cart={cart}/>
      <div>
        <h3>Total: ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}</h3>
      </div>
    </div>
  );
}

export default CartPage;
