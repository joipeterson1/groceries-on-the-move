import { Link , useHistory } from "react-router-dom";
import "./NavBar.css";
import {useCart} from "../components/CartContext"


function NavBar({/*cartData,*/ profileData,setProfileData/*, onLogout*/}){
    const { totalItems } = useCart(); 
    const history = useHistory()

    function onLogout() {
        setProfileData(null);
        // setCartData([]);
        fetch('/logout', { method: 'DELETE' })
          .then(() => {
            history.push('/');
          })
          .catch((error) => console.error('Logout failed', error));
      }
    return (
        <nav>
          <div>
            <Link to="/">Home</Link>
            <Link to="/cart-page">Cart: {totalItems}</Link>
            <Link to="/profile">Profile</Link>
          </div>
          <div>
            {profileData ? (
              <button onClick={onLogout}>Logout</button>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </nav>
      );
}

export default NavBar