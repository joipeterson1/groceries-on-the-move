import React, {useEffect} from "react";
import "../../index.css"


function Profile({orders, setOrders, profileData, setProfileData}) {

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
      }, [setProfileData]);

      useEffect(()=> {
        fetch('/orders')
        .then((r)=> r.json())
        .then((orders)=> 
            setOrders(orders)
        )
        .catch((error) => {
          console.error('Error fetching orders:', error);
          setOrders([]);
        })
      }, [setOrders])

      console.log(orders)

    return(
        <div>
        <h1>Welcome Back {profileData.name}!</h1>
        <br />
        <h2>Demographic Information</h2>
        <br />
        <p>Name: {profileData.name}</p>
        <p>Username: {profileData.username}</p>
        <p>Email: {profileData.email}</p>
        <p>Phone Number: {profileData.phone_number}</p>
        <p>Address: {profileData.address}</p>
        <table style={{padding: "15px"}}>
            <thead>
                <tr>
                    <th>Order Number</th>
                    <th>Order Date</th>
                    <th>Order Total</th>
                    <th>Products</th>
                </tr>
            </thead>
            <tbody>
                    {orders && orders.length > 0 ? (
                        orders.map((order) => (
                            <tr key={order.id}>
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
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No Orders Yet</td>
                        </tr>
                    )}
                </tbody>
        </table>
        </div>
    )
}

export default Profile