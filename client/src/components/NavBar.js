import { NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar({cart, onLogout}){
    const cartCount = cart ? cart.length : 0

    return (
        <nav>
            <NavLink to="/" exact activeClassName="active-link">Home</NavLink>
            <NavLink to="/profile" activeClassName="active-link">Profile</NavLink>
            <NavLink to="/cart-page" activeClassName="active-link">Cart {cartCount}</NavLink>
            <NavLink to="/login" activeClassName="active-link">Login</NavLink>
            <button onClick={onLogout}>Logout</button>
        </nav>
    )
}

export default NavBar