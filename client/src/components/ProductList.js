import React from "react";


function ProductList({ products, AddToCart }) {
  return (
    <div>
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.product_img} alt={product.product_name} />
          <h3>{product.product_name}</h3>
          <p>${product.price}</p>
          <button onClick={() => AddToCart(product)}>Add to Cart</button> {/* Add product to cart */}
        </div>
      ))}
    </div>
  );
}

export default ProductList;
