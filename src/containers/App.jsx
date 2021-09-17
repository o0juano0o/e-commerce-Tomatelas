import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Home from "./Home";
import Navbar from "../components/Navbar";
import Cart from "../components/Cart";
import AfterCompra from "../components/AfterCompra";

import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../themeConfig";
import Register from "./Register";
import Profile from "../components/Profile";
import Admin from "../components/Admin";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../containers/Login";
import SingleProductView from "../components/SingleProductView";
import { useDispatch, useSelector } from "react-redux";
import { setLocalUser } from "../store/users";
import { setLocalCart } from "../store/cart";
import { getAllProducts } from "../store/products";
import ForBidden from "../components/ForBidden";
import AdminSingleProduct from "../components/AdminSingleProduct";
import AdminNewProduct from "../components/AdminNewProduct";

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) dispatch(setLocalUser(user));
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart) dispatch(setLocalCart(cart));
    dispatch(getAllProducts());
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Navbar />

        <Switch>
          <Route exact path="/home" render={() => <Home />} />

          <Route path="/register">
            <Register />
          </Route>

          <PrivateRoute path="/profile">
            <Profile />
          </PrivateRoute>

          <PrivateRoute path="/admin">
            {user.isAdmin ? <Admin /> : <ForBidden />}
          </PrivateRoute>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/cart">
            <Cart />
          </Route>

          <Route path="/confirmacion">
            <AfterCompra />
          </Route>

          <Route
            exact
            path="/products/:id"
            render={({ match }) => <SingleProductView id={match.params.id} />}
          />
          <Route
            exact
            path="/edit/products/:id"
            render={({ match }) => <AdminSingleProduct id={match.params.id} />}
          />
          <Route exact path="/create/products/">
            <AdminNewProduct />
          </Route>
          <Redirect from="/" to="/home" />
        </Switch>
      </ThemeProvider>
    </>
  );
}
