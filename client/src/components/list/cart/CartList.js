import React from "react";
import CartCard from "../cart/CartCard"


function CartList({ cartItems }) {
  return (
    <div>
      {cartItems ?       
      (<ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            <CartCard item={item}/>
          </li>
        ))}
      </ul>) : <h3> Your cart is empty!</h3>}
    </div>
  );
}

export default CartList;