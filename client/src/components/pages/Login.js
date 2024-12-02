import React from "react";
import {useState} from "react"
import NavBar from "../NavBar"
import {useHistory} from "react-router-dom"

function Login({customer/*, setCustomer*/, setIsLoggedIn, isLoggedIn}) {
    const history = useHistory()
    const [loginFormData, setLoginFormData] = useState({
        username: "",
        password: ""
    })
    const [signupFormData, setSignupFormData] = useState({
        username: "",
        password: "",
        name: "",
        phone_number: "",
        email: "",
        address: ""
    })
    const [loginError, setLoginError] = useState(null); // Error handling for login
    const [signupError, setSignupError] = useState(null); // Error handling for signup
    const [loading, setLoading] = useState(false);

    function onLogin(){
        /*setCustomer(customer)*/
        setIsLoggedIn(true)
        history.push("/profile")
      }

    function signupHandleChange(e){
        setSignupFormData({
            ...signupFormData,
            [e.target.name]: e.target.value,
        })
    }

    function handleChange(e){
        setLoginFormData({
            ...loginFormData,
            [e.target.name]: e.target.value,
        })
    }

    function handleLogin(e) {
    fetch("/login", {
      method: "POST",
      body: JSON.stringify(loginFormData),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((r) => {
        if (r.ok) {
          r.json().then(() => {
            onLogin();
          });
        } else {
          r.json().then((error) => {
            setLoginError(error.message);
          });
        }
      })
      .catch((error) => {
        console.error("Error during login request:", error);
        setLoginError("Login failed. Please try again.");
      })
      .finally(() => setLoading(false));
  }

  function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setSignupError(null); 

    fetch("/signup", {
      method: "POST",
      body: JSON.stringify(signupFormData),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((r) => {
        if (r.ok) {
          r.json().then((customer) => {
            onLogin(customer);
          });
        } else {
          r.json().then((error) => {
            setSignupError(error.message);
          });
        }
      })
      .catch((error) => {
        console.error("Error during signup request:", error);
        setSignupError("Signup failed. Please try again.");
      })
      .finally(() => setLoading(false));
  }

    const renderSignupForm = () => (
        <form onSubmit={handleSignup}>
            <label htmlFor="username">Username</label>
            <div>
                <input
                id="signup-username"
                type="text"
                name="username"
                value={signupFormData.username}
                onChange={signupHandleChange}
                />
            </div>
            <label htmlFor="password">Password</label>
            <div>
                <input
                id="signup-password"
                type="text"
                name="password"
                value={signupFormData.password}
                onChange={signupHandleChange}
                />
            </div>
            <label htmlFor="name">Name</label>
            <div>
                <input
                id="name"
                type="text"
                name="name"
                value={signupFormData.name}
                onChange={signupHandleChange}
                />
            </div>
            <label htmlFor="phone_number">Phone Number</label>
            <div>
                <input
                id="phone_number"
                type="text"
                name="phone_number"
                value={signupFormData.phone_number}
                onChange={signupHandleChange}
                />
            </div>
            <label htmlFor="email">Email</label>
            <div>
                <input
                id="email"
                type="text"
                name="email"
                value={signupFormData.email}
                onChange={signupHandleChange}
                />
            </div>
            <label htmlFor="address">Address</label>
            <div>
                <input
                id="address"
                type="text"
                name="address"
                value={signupFormData.address}
                onChange={signupHandleChange}
                />
            </div>
                {signupError && <p style={{ color: "red" }}>{signupError}</p>}
            <button type="submit" disabled={loading}>
                {loading ? "Signing up..." : "Sign up now!"}
            </button>
        </form>
    )

    const renderLoginForm = () => (
        <form onSubmit={handleLogin}>
          <header>
            <NavBar />
          </header>
          <label htmlFor="username">Username</label>
          <div>
            <input
              id="username"
              type="text"
              name="username"
              value={loginFormData.username}
              onChange={handleChange}
            />
          </div>
          <label htmlFor="password">Password</label>
          <div>
            <input
              id="password"
              type="password"
              name="password"
              value={loginFormData.password}
              onChange={handleChange}
            />
          </div>
            {loginError && <p style={{ color: "red" }}>{loginError}</p>}
            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
      );


if (!isLoggedIn) {
    return (
        <>
          {renderLoginForm()}
          <h2> Create your account: </h2>
          {renderSignupForm()}
        </>
      );
}
}

export default Login;