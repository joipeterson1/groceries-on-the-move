import React, { useEffect, useState } from "react";
import { Switch, Route, Link } from "react-router-dom";

function ProductCard({product, AddToCart}) {
  
  return (
      <div>
        <img src={product.product_img} alt="product_img"/>
        <h4>{product.name}</h4>
        <Link to="/product-page" state={{product}}>View product details</Link>
        <button onClink={() => AddToCart(product)}>Add to Cart</button>
      </div>
  );
}

export default ProductCard;