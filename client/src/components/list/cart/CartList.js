import React from "react";
import CartCard from "../cart/CartCard"


function CartList({ cart }) {
  if (cart.length === 0) {
    return <h2>Your cart is empty.</h2>;
  }

  return (
    <div>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            <CartCard item={item}/>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CartList;