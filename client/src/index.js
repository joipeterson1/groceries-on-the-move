import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./components/pages/App";
import Profile from "./components/pages/Profile";
import CartPage from "./components/pages/CartPage";
import Login from "./components/pages/Login";
import ProductPage from "./components/pages/ProductPage"
import OrderDetails from "./components/pages/OrderDetails";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
  <BrowserRouter>
      <Switch> 
      <Route exact path="/" component={App} /> 
      <Route path="/product-page/:id" component={ProductPage} /> 
      <Route path="/profile" component={Profile} />
      <Route path="/cart-page" component={CartPage} />
      <Route path="/login" component={Login} />
      <Route path="/order" component={OrderDetails} />
    </Switch>
  </BrowserRouter>
);


