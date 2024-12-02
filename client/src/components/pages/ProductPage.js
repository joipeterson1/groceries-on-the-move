import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../NavBar";

function ProductPage({AddToCart}) {
  const { id } = useParams()
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/products/${id}`)
      .then((r) => r.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
        <header>
            <NavBar/>
        </header>
      <h2>Product Details</h2>
      <h3>{product.product_name}</h3>
      <img src={product.product_img} alt="product_img"/>
      <p>Price: ${product.price}</p>
     <button onClick={() => AddToCart(product)}>Add to Cart</button>
    </div>
  );
}

export default ProductPage;
