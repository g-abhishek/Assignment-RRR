
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.2.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import AdminLayout from "layouts/Admin.js";
import UserLayout from "./layouts/Employee.js";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import './index.css';

// import LoginPage
import LoginPage from './components/Login/LoginPage'
import AdminLogin from './components/Login/AdminLogin.js'

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <ReactNotification />
    <Switch>
      <Route exact path="/login" render={(props) => <LoginPage {...props} />} />
      <Route exact path="/login/admin" render={(props) => <AdminLogin {...props} />} />
      <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
      <Route path="/user" render={(props) => <UserLayout {...props} />} />
      
      {localStorage.getItem('tokn') ? (JSON.parse(localStorage.getItem('usr')).role === 0 ? <Redirect to="/admin/dashboard" /> : <Redirect to="/user" />)  : <Redirect to="/login" />}
      {/* {localStorage.getItem('tokn') ? <Redirect to="/admin/dashboard" /> : <Redirect to="/login" />} */}
      
    </Switch>
  </Router>,
  document.getElementById("root")
);
