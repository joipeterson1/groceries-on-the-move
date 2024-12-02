import React from "react";
import {useState} from "react"
import NavBar from "../NavBar"
import {useHistory} from "react-router-dom"


function Login({onLogin, isLoggedIn, isSignedUp, setIsSignedUp}) {
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

    function handleChange(e){
        if (isSignedUp){
            (setLoginFormData({
                ...loginFormData,
                [e.target.name]: e.target.value,
            }))
        } else {
        (setSignupFormData({
            ...signupFormData,
            [e.target.name]: e.target.value,
        }))
    }
}

    function handleLogin(e) {
        e.preventDefault();
        fetch('http://127.0.0.1:5555/login', {
            method: 'POST',
            body: JSON.stringify(loginFormData),
            headers: { 'Content-Type': 'application/json' }
        })
            .then((r) => {
                if (r.ok) {
                    r.json().then((customer) => onLogin(customer));
                }
            });
    }


    function handleSignup(e){
        e.preventDefault()
        fetch('http://127.0.0.1:5555/signup', {
            method: 'POST',
            body: JSON.stringify(signupFormData),
            headers: { 'Content-Type': 'application/json' }
        })
            .then((r) => {
                if (r.ok) {
                    r.json().then((customer) => onLogin(customer));
                }
            });
    }

    function ToggleSignUp(){
        setIsSignedUp(!isSignedUp)
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
                onChange={handleChange}
                />
            </div>
            <label htmlFor="password">Password</label>
            <div>
                <input
                id="signup-password"
                type="text"
                name="password"
                value={signupFormData.password}
                onChange={handleChange}
                />
            </div>
            <label htmlFor="name">Name</label>
            <div>
                <input
                id="name"
                type="text"
                name="name"
                value={signupFormData.name}
                onChange={handleChange}
                />
            </div>
            <label htmlFor="phone_number">Phone Number</label>
            <div>
                <input
                id="phone_number"
                type="text"
                name="phone_number"
                value={signupFormData.phone_number}
                onChange={handleChange}
                />
            </div>
            <label htmlFor="email">Email</label>
            <div>
                <input
                id="email"
                type="text"
                name="email"
                value={signupFormData.email}
                onChange={handleChange}
                />
            </div>
            <label htmlFor="address">Address</label>
            <div>
                <input
                id="address"
                type="text"
                name="address"
                value={signupFormData.address}
                onChange={handleChange}
                />
            </div>
            <button type="submit">Sign up now!</button>
            
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
          <button type="submit">Login</button>
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
} else {
    {history.push("/profile")}
}
}

export default Login;