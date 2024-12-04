import { Link } from "react-router-dom";

function ProductCard({product, AddToCart}) {
  
  return (
      <div>
        <img src={product.product_img} alt="product_img"/>
        <h2>{product.product_name}</h2>
        <h4>${product.price}</h4>
        <button onClick={AddToCart}>Add to Cart</button>
      </div>
  );
}

export default ProductCard;