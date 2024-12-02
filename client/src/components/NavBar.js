import { NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar({cart, logout}){
    const cartCount = cart.length;

    return (
        <nav>
            <NavLink
                to="/"
                classname = "nav-link"
            >
                Home
            </NavLink>
            <NavLink
                to="/my-cart"
                classname = "nav-link"
            >
                My Cart ({cartCount})
            </NavLink>
            <NavLink
                to="/login"
                classname = "nav-link"
            >
                Login / SignUp
            </NavLink>
            <NavLink
                to="/profile"
                classname = "nav-link"
            >
                My Profile
            </NavLink>
            <button onClick={logout}>Logout</button>
        </nav>
    )
}

export default NavBar