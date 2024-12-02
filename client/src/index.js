import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./components/pages/App";
import Profile from "./components/pages/Profile";
import CartPage from "./components/pages/CartPage";
import Login from "./components/pages/Login";
import ProductPage from "./components/pages/ProductPage"

// Render the application with BrowserRouter and Routes
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
  <App/>
);


