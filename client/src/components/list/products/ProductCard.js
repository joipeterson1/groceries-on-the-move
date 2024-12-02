import React, { useEffect, useState } from "react";
import { Switch, Route, Link } from "react-router-dom";

function ProductCard({product, AddToCart}) {
  
  return (
      <div>
        <img src={product.product_img} alt="product_img"/>
        <h4>{product.product_name}</h4>
        <Link to={`/product-page/${product.id}`}>View Product Details</Link>
        <button onClick={() => AddToCart(product)}>Add to Cart</button>
      </div>
  );
}

export default ProductCard;