import React from "react";
import ProductCard from './ProductCard'

function ProductList({products, /*AddToCart*/}) {
  return (
    <div>
        {products.map((product)=> (
            <ProductCard 
            key={product.id} 
            product={product}
            /*AddToCart={AddToCart}*/
            />
        ))}
      </div>
  );
}

export default ProductList;