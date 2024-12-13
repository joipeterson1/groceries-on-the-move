import React, { useState, useEffect } from "react";
import "../../src/index.css";
import { useFormik } from "formik";
import * as yup from "yup";

function OrderList({ fetchOrders, setProfileData, onEdit, orders, onDelete }) {
    const [editingOrderId, setEditingOrderId] = useState(null);

    useEffect(() => {
        fetch('/check-session')
          .then((r) => r.json())
          .then((customer) => 
              setProfileData(customer)
          )
          .catch((error) => {
            console.error('Error fetching products:', error);
            setProfileData({})
          });
      }, []);

    function EditOrder(orderId) {
        setEditingOrderId(orderId === editingOrderId ? null : orderId);

        const orderToEdit = orders.find((order) => order.id === orderId);
        if (orderToEdit && orderToEdit.products && orderToEdit.products.length > 0) {
            const product = orderToEdit.products[0];
            productFormik.setValues({
                product_name: product.product_name,
                quantity: product.quantity,
                id: product.id,
            });
        }
    }

    function DeleteOrder(orderId) {
        fetch(`/orders/${orderId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((r) => r.json())
            .then((data) => {
                console.log(data);
                fetchOrders()
                onDelete(orderId);
            })
            .catch((error) => {
                console.error("Error deleting order:", error);
                alert("Failed to delete the order.");
            });
    }

    const productFormSchema = yup.object().shape({
        product_name: yup.string().required("Must enter a product name"),
        quantity: yup.number().required("Must enter a quantity").positive().integer(),
    });

    const productFormik = useFormik({
        initialValues: {
            product_name: "",
            quantity: 1,
        },
        validationSchema: productFormSchema,
        onSubmit: (values) => {
            const updatedOrder = {
                products: [
                    {
                        id: values.id,
                        quantity: values.quantity,
                    },
                ],
            };
            fetch(`/orders/${editingOrderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedOrder),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Updated order:", data);
                    fetchOrders();
                    setEditingOrderId(null);
                    onEdit(data)
                })
                .catch((error) => {
                    console.error("Error updating order:", error);
                });
        },
    });

    const updateForm = (
        <div>
            <form onSubmit={productFormik.handleSubmit} style={{margin: "30px"}}>
            <label htmlFor="product_name"> Product Name</label>
            <br />
            <input 
                id="product_name"
                name="product_name"
                onChange={productFormik.handleChange}
                value={productFormik.values.product_name}
            />
            <p style={{color: "red"}}>{productFormik.errors.product_name}</p>
            <label htmlFor="quantity">Quantity</label>
            <br />
            <input 
                id="quantity"
                name="quantity"
                type="number"
                onChange={productFormik.handleChange}
                value={productFormik.values.quantity}
            />
            <p style={{color: "red"}}>{productFormik.errors.quantity}</p>
            <button type="submit">Update</button>
            </form>
        </div>
    )

    return (
        <div>
          <table style={{ padding: "15px" }}>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Order Date</th>
                <th>Order Total</th>
                <th>Products</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr>
                      <td>{order.id}</td>
                      <td>{order.order_date}</td>
                      <td>${order.order_total.toFixed(2)}</td>
                      <td>
                        {order.products ? (
                          <ul>
                            {order.products.map((product) => (
                              <li key={product.id}>
                                <strong>{product.product_name}</strong> - ${product.price} x {product.quantity}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No products available</p>
                        )}
                      </td>
                      <td>
                        <button onClick={() => DeleteOrder(order.id)}>Cancel</button>
                      </td>
                      <td>
                        <button onClick={() => EditOrder(order.id)}>
                          {editingOrderId === order.id ? "Cancel Edit" : "Edit"}
                        </button>
                      </td>
                    </tr>
    
                    {editingOrderId === order.id && (
                      <tr>
                        <td colSpan="6">
                          {updateForm}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No Orders Yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }
    
    export default OrderList;