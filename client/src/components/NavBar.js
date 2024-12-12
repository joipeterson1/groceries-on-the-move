import { NavLink } from "react-router-dom";
import "./NavBar.css";
import React from "react"

function NavBar({fetchOrders, cartData, onLogout}){
    const cart = cartData || []
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    function handleLogout(){
      fetch("/logout", {
        method: "DELETE",
      }).then(()=> onLogout())
    }

    function profileClick(){
      fetchOrders()
    }


    return (
        <nav>
          <div>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/login">Login/Signup</NavLink>
            <NavLink cart={cart} to="/cart-page">Cart: {cartCount}</NavLink>
            <NavLink to="/profile" onClick={profileClick}>My Profile</NavLink>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      );
}

export default NavBar