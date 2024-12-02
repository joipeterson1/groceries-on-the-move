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
  <BrowserRouter>
      <Switch> {/* Use Switch instead of Routes in React Router v5 */}
      <Route exact path="/" component={App} /> {/* Use 'component' prop */}
      <Route path="/product-page/:id" component={ProductPage} /> {/* Dynamic product page */}
      <Route path="/profile" component={Profile} />
      <Route path="/cart-page" component={CartPage} />
      <Route path="/login" component={Login} />
    </Switch>
  </BrowserRouter>
);


