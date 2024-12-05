import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import NavBar from "../NavBar"; 

function Profile({ setCustomer, setIsLoggedIn, isLoggedIn }) {
  const history = useHistory();
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch("/check-session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Unauthorized');
      })
      .then((data) => {
        if (data) {
          console.log('Profile data:', data);
          setProfileData(data);
  
          return fetch("/orders", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
        }
      })
      .then((response) => response.json()) 
      .then((orderData) => {
        if (orderData) {
          console.log('Order data:', orderData);
          setOrders(orderData || []);
        }
      })
  }, []);
  
  const handleLogout = () => {
    fetch("/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        if (r.ok) {
          setIsLoggedIn(false);
          setCustomer(null);
          history.push("/login");
        }
      })
  };


 
  return (
    (profileData ?
    <div>
      <header>
        <NavBar />
      </header>
      <h1>Welcome back {profileData.name}!</h1>
      <div>
        <p><strong>Username:</strong> {profileData.username}</p>
        <p><strong>Name:</strong> {profileData.name}</p>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Phone:</strong> {profileData.phone_number}</p>
        <p><strong>Address:</strong> {profileData.address}</p>
      </div>
      <div>
      <h2>Your Orders</h2>
      </div>
      <div>
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{new Date(order.order_date).toLocaleDateString()}</td>
                  <td>{order.order_total}</td>
                  <td>
                    <button onClick={() => history.push(`/order/${order.id}`)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div> : 
        <div>
        <header>
          <NavBar />
        </header>
        <h1>Please Login!</h1>
      </div>
    )
  );
}

export default Profile;

