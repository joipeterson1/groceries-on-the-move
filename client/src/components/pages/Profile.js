import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import NavBar from "../NavBar"; 

function Profile({ customer, setCustomer, setIsLoggedIn }) {
  const history = useHistory();
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    // Fetch profile data
    fetch("http://127.0.0.1:5555/check-session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensures cookies are included in the request
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch session data');
        }
        return response.json(); // Parse JSON if the response is ok
      })
      .then((data) => {
        if (data) {
          console.log('Profile data:', data);
          setProfileData(data);
  
          // Fetch orders after getting profile data
          return fetch("http://127.0.0.1:5555/orders", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
        } else {
          throw new Error("No profile data found.");
        }
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        return response.json(); // Parse JSON if the response is ok
      })
      .then((orderData) => {
        if (orderData) {
          console.log('Order data:', orderData);
          setOrders(orderData);
        } else {
          setOrders([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false); // Always stop loading in case of error
      });
  }, []);
  
  

  const handleLogout = () => {
    fetch("http://127.0.0.1:5555/logout", {
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
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };


  if (loading) {
    return <div>Loading...</div>;
  }


  if (error) {
    return <div>{error}</div>;
  }

 
  return (
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

      <h2>Your Orders</h2>
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
    </div>
  );
}

export default Profile;

