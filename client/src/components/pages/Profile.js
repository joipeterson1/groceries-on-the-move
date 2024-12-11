import React, {useEffect} from "react";
import "../../index.css"
import OrderList from "../OrderList"


function Profile({onEdit, orders, setOrders, profileData, setProfileData, onDelete}) {

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
        <OrderList orders={orders} setOrders={setOrders} onDelete={onDelete} onEdit={onEdit}/>
        </div>
    )
}

export default Profile