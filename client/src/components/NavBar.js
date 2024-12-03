import { NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar({cart, profileData, onLogout}){
    const cartCount = cart ? cart.length : 0

    return (
        <nav>
            <NavLink to="/" exact activeClassName="active-link">Home</NavLink>
            <NavLink to="/profile" activeClassName="active-link">Profile</NavLink>
            <NavLink to="/cart-page" activeClassName="active-link">Cart {cartCount}</NavLink>
            {profileData ? null : <NavLink to="/login" activeClassName="active-link">Login</NavLink>}
            <div>
            { profileData ? <button onClick={onLogout}>Logout</button> : null}
            </div>
        </nav>
    )
}

export default NavBar