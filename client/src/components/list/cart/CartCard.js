import React from "react";

function CartCard({ item }) {
  return (
    <div>
      <img src={item.product_img} alt={item.product_name} style={{width: '50px'}} />
      <p>{item.product_name}</p>
      <p>${item.price}</p>
    </div>
  );
}

export default CartCard;