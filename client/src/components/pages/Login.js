import React from "react";
import {useState} from "react"
// import {useOutletContext} from "react-router-dom"
import NavBar from "../NavBar"
import { or } from "ajv/dist/compile/codegen";


function Login({isLoggedIn, setIsLoggedIn, isSignedUp, setIsSignedUp}) {
    // const login = useOutletContext()
    // const profile = useOutletContext()
    const [formData, setFormData] = useState({
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
        (setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        }))
        or
        (setSignupFormData({
            ...signupFormData,
            [e.target.name]: e.target.value,
        }))
    }

    const login = () => {
    setIsLoggedIn(true);
    };

    function handleLogin(e){
        e.preventDefault()
        fetch('/login').then((r)=> {
            if (r.ok){
                r.json().then((login)=> setIsLoggedIn(login))
            }
        })
        login()
    }

    const profile = () => {
        setIsSignedUp(true);
      };

    function handleSignup(e){
        e.preventDefault()
        fetch('/signup').then((r)=> {
            if (r.ok){
                r.json().then((signup)=> setIsSignedUp(signup))
            }
        })
       profile()
    }

    function signupForm(){
        if (isSignedUp === false){
        <form onSubmit={handleSignup}>
            <header>
                <NavBar/>
            </header>
            <label for="username">Username</label>
            <div>
                <input
                id="username"
                type="text"
                name="username"
                value={signupFormData.username}
                onChange={handleChange}
                />
            </div>
            <label for="password">Password</label>
            <div>
                <input
                id="password"
                type="text"
                name="password"
                value={signupFormData.password}
                onChange={handleChange}
                />
            </div>
            <label for="name">Name</label>
            <div>
                <input
                id="name"
                type="text"
                name="name"
                value={signupFormData.name}
                onChange={handleChange}
                />
            </div>
            <label for="phone_number">Phone Number</label>
            <div>
                <input
                id="phone_number"
                type="text"
                name="phone_number"
                value={signupFormData.phone_number}
                onChange={handleChange}
                />
            </div>
            <label for="email">Email</label>
            <div>
                <input
                id="email"
                type="text"
                name="email"
                value={signupFormData.email}
                onChange={handleChange}
                />
            </div>
            <label for="address">Address</label>
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
    }}

    function ToggleSignUp(){
        setIsSignedUp((isSignedUp)=> !isSignedUp)
    }

if (isLoggedIn === false) {
    return (
        <form onSubmit={handleLogin}>
            <header>
                <NavBar/>
            </header>
            <label for="username">Username</label>
            <div>
                <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                />
            </div>
            <label for="password">Password</label>
            <div>
                <input
                id="password"
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                />
            </div>
            <button type="submit">Login</button>
            <link onClick={ToggleSignUp}>{isSignedUp ? "Create an account" : "I already have an account"}.</link>
            {signupForm}
        </form>
      );
}
}

export default Login;