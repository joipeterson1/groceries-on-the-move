import { NavLink } from "react-router-dom";
import "./NavBar.css";
import React, {useEffect} from "react"

function NavBar({cartData, setProfileData, onLogout}){
    const cart = cartData || []
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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

    function handleLogout(){
      fetch("/logout", {
        method: "DELETE",
      }).then(()=> onLogout())
    }


    return (
        <nav>
          <div>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/login">Login/Signup</NavLink>
            <NavLink cart={cart} to="/cart-page">Cart: {cartCount}</NavLink>
            <NavLink to="/profile">My Profile</NavLink>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      );
}

export default NavBar