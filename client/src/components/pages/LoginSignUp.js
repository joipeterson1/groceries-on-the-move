import React, {useEffect, useState} from "react";
import {useFormik} from "formik"
import * as yup from "yup"

function LoginSignUp({setProfileData, profileData}) {
    const [refreshPage, setRefreshPage] = useState(false)
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
      }, []);

    const loginFormSchema = yup.object().shape({
        username: yup.string().required("Must enter a username"),
        password: yup.string().required("Must enter a password")
    })

    const signupFormSchema = yup.object().shape({
        name: yup.string().required("Customer name is required"),
        phone_number: yup.number().integer().positive().required("Customer phone number is required").typeError("Please enter an Integer"),
        email: yup.string().email("Invalid email").required("Must enter an email"),
        address: yup.string().required("Must enter an address"),
        username: yup.string().required("Must enter a username"),
        password: yup.string().required("Must enter a password")
    })

    const loginFormik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: loginFormSchema,
        onSubmit: (values) => {
            fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            }).then((res)=> {
                if (res.status === 200) {
                    setRefreshPage(!refreshPage)
                    setProfileData(res)
                }
            })
        }
    })

    const signupFormik = useFormik({
        initialValues: {
            name: "",
            phone_number: "",
            email: "",
            address: "",
            username: "",
            password: "",
        },
        validationSchema: signupFormSchema,
        onSubmit: (values) => {
            fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            }).then((res)=> {
                if (res.status === 200) {
                    setRefreshPage(!refreshPage)
                    setProfileData(res)
                }
            })
        }
    })
    

    return(
        <div>
        <h3>Please Login</h3>
        <form onSubmit={loginFormik.handleSubmit} style={{margin: "30px"}}>
            <label htmlFor="username"> Username</label>
            <br />
            <input 
                id="username"
                name="username"
                onChange={loginFormik.handleChange}
                value={loginFormik.values.username}
            />
            <p style={{color: "red"}}>{loginFormik.errors.username}</p>
            <label htmlFor="password">Password</label>
            <br />
            <input 
                id="password"
                name="password"
                onChange={loginFormik.handleChange}
                value={loginFormik.values.password}
            />
            <p style={{color: "red"}}>{loginFormik.errors.password}</p>
            <button type="submit">Login</button>
        </form>
        <h3>New Here? Create your account below</h3>
        <form onSubmit={signupFormik.handleSubmit} style={{margin: "30px"}}>
        <label htmlFor="name"> Name</label>
            <br />
            <input 
                id="name"
                name="name"
                onChange={signupFormik.handleChange}
                value={signupFormik.values.name}
            />
            <p style={{color: "red"}}>{signupFormik.errors.name}</p>
            <label htmlFor="phone_number"> Phone Number</label>
            <br />
            <input 
                id="phone_number"
                name="phone_number"
                onChange={signupFormik.handleChange}
                value={signupFormik.values.phone_number}
            />
            <p style={{color: "red"}}>{signupFormik.errors.phone_number}</p>
            <label htmlFor="email"> Email</label>
            <br />
            <input 
                id="email"
                name="email"
                onChange={signupFormik.handleChange}
                value={signupFormik.values.email}
            />
            <p style={{color: "red"}}>{signupFormik.errors.email}</p>
            <label htmlFor="address"> Address</label>
            <br />
            <input 
                id="address"
                name="address"
                onChange={signupFormik.handleChange}
                value={signupFormik.values.address}
            />
            <p style={{color: "red"}}>{signupFormik.errors.address}</p>
            <label htmlFor="username"> Username</label>
            <br />
            <input 
                id="username"
                name="username"
                onChange={signupFormik.handleChange}
                value={signupFormik.values.username}
            />
            <p style={{color: "red"}}>{signupFormik.errors.username}</p>
            <label htmlFor="password">Password</label>
            <br />
            <input 
                id="password"
                name="password"
                onChange={signupFormik.handleChange}
                value={signupFormik.values.password}
            />
            <p style={{color: "red"}}>{signupFormik.errors.password}</p>
            <button type="submit">Signup</button>
        </form>
        </div>

    )
}

export default LoginSignUp