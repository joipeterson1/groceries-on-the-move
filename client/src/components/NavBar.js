import { NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar({cartData, profileData, onLogout}){
    const cart = cartData || []
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    function handleLogout(){
      fetch("/logout", {
        method: "DELETE",
      }).then(()=> onLogout())
    }
    return (
        <nav>
          <div>
            <NavLink to="/">Home</NavLink>
            {profileData ? null : 
            <NavLink to="/login">Login/Signup</NavLink> }
            <NavLink cart={cart} to="/cart-page">Cart: {cartCount}</NavLink>
            <NavLink to="/profile">My Profile</NavLink>
            {profileData ? 
            <button onClick={handleLogout}>Logout</button> :
            null
            } 
          </div>
        </nav>
      );
}

export default NavBar