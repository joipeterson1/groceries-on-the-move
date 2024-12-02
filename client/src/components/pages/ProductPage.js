import React from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../NavBar"

function ProductPage({ AddToCart }) {
  const location = useLocation();
  const { product } = location.state;

  return (
    <div>
        <header>
            <NavBar/>
        </header>
      <h1>{product.name}</h1>
      <img src={product.product_img} alt="product_img" />
      <h4>{product.price}</h4>
      <button onClick={() => AddToCart(product)}>Add to Cart</button>
    </div>
  );
}

export default ProductPage;
