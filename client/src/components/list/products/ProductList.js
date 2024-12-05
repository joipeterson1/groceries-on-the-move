import React from "react";
import { useCart } from "../../CartContext"; // Import the useCart hook

function ProductList({ products }) {
  const { addToCart } = useCart(); // Access the addToCart function

  return (
    <div>
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.product_img} alt={product.product_name} />
          <h3>{product.product_name}</h3>
          <p>${product.price}</p>
          <button onClick={() => addToCart(product)}>Add to Cart</button> {/* Add product to cart */}
        </div>
      ))}
    </div>
  );
}

export default ProductList;
