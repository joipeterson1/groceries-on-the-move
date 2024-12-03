import React from "react";
import {useState} from "react"
import NavBar from "../NavBar"
import {useHistory} from "react-router-dom"
import {useFormik} from "formik"
import * as yup from "yup"

function Login() {
    const history = useHistory()
    const [loginError, setLoginError] = useState(null)
    const [signupError, setSignupError] = useState(null)
    const [loading, setLoading] = useState(false);

    function onLogin(){
        history.push("/profile")
      }

      const loginFormSchema = yup.object().shape({
        username: yup.string().required("Must enter username"),
        password: yup.string().required("Must enter password")
      })
      
      const loginFormik = useFormik({
        initialValues: {
          username: "",
          password: ""
        },
        validationSchema: loginFormSchema,
        onSubmit: (values) => {
        fetch("/login", {
            method: "POST",
            body: JSON.stringify(values),
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
      })

  const signupFormSchema = yup.object().shape({
    signup_username: yup.string().required("Must enter username"),
    signup_password: yup.string().required("Must enter password"),
    name: yup.string().required("Must enter name").max(75),
    phone_number: yup.number().positive().integer().required("Must enter phone number").typeError("Please enter a 10 digit integer").max(10),
    email: yup.string().email("Invalid email").required("Must enter email"),
    address: yup.string().required("Must enter address")
  })
  
  const signupFormik = useFormik({
    initialValues: {
      signup_username: "",
      signup_password: "",
      name: "",
      phone_number: "",
      email: "",
      address: ""
    },
    validationSchema: signupFormSchema,
    onSubmit: (values) => {
      fetch("/signup", {
        method: "POST",
        body: JSON.stringify(values),
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
  })

    const renderSignupForm = () => (
        <form onSubmit={signupFormik.handleSubmit}>
            <label htmlFor="username">Username</label>
            <div>
                <input
                id="signup_username"
                type="text"
                name="username"
                value={signupFormik.values.signup_username}
                onChange={signupFormik.handleChange}
                />
                <p style={{color: "red"}}> {signupFormik.errors.username}</p>
            </div>
            <label htmlFor="password">Password</label>
            <div>
                <input
                id="signup_password"
                type="text"
                name="password"
                value={signupFormik.values.signup_password}
                onChange={signupFormik.handleChange}
                />
                <p style={{color: "red"}}> {signupFormik.errors.password}</p>
            </div>
            <label htmlFor="name">Name</label>
            <div>
                <input
                id="name"
                type="text"
                name="name"
                value={signupFormik.values.name}
                onChange={signupFormik.handleChange}
                />
                <p style={{color: "red"}}> {signupFormik.errors.name}</p>
            </div>
            <label htmlFor="phone_number">Phone Number</label>
            <div>
                <input
                id="phone_number"
                type="text"
                name="phone_number"
                value={signupFormik.values.phone_number}
                onChange={signupFormik.handleChange}
                />
                <p style={{color: "red"}}> {signupFormik.errors.phone_number}</p>
            </div>
            <label htmlFor="email">Email</label>
            <div>
                <input
                id="email"
                type="text"
                name="email"
                value={signupFormik.values.email}
                onChange={signupFormik.handleChange}
                />
                <p style={{color: "red"}}> {signupFormik.errors.email}</p>
            </div>
            <label htmlFor="address">Address</label>
            <div>
                <input
                id="address"
                type="text"
                name="address"
                value={signupFormik.values.address}
                onChange={signupFormik.handleChange}
                />
                <p style={{color: "red"}}> {signupFormik.errors.address}</p>
            </div>
                {signupError && <p style={{ color: "red" }}>{signupError}</p>}
            <button type="submit" disabled={loading}>
                {loading ? "Signing up..." : "Sign up now!"}
            </button>
        </form>
    )

    const renderLoginForm = () => (
        <form onSubmit={loginFormik.handleSubmit}>
          <header>
            <NavBar />
          </header>
          <label htmlFor="username">Username</label>
          <div>
            <input
              id="username"
              type="text"
              name="username"
              value={loginFormik.values.username}
              onChange={loginFormik.handleChange}
            />
            <p style={{ color: "red" }}> {loginFormik.errors.username}</p>
          </div>
          <label htmlFor="password">Password</label>
          <div>
            <input
              id="password"
              type="password"
              name="password"
              value={loginFormik.values.password}
              onChange={loginFormik.handleChange}
            />
            <p style={{ color: "red" }}> {loginFormik.errors.password}</p>
          </div>
            {loginError && <p style={{ color: "red" }}>{loginError}</p>}
            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
      );

    return (
        <>
          {renderLoginForm()}
          <h2> Create your account: </h2>
          {renderSignupForm()}
        </>
      );
}

export default Login;