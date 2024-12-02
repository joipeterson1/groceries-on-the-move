import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5555/orders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        } else {
          throw new Error("Error fetching order details.");
        }
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
      <p><strong>Total:</strong> {order.order_total}</p>

      <h2>Products:</h2>
      <ul>
        {order.products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderDetails;
