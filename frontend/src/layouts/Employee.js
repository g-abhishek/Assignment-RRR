
import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch } from "react-router-dom";

import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import {sidebarRoutes, routes} from "routes.js";
import Axios from "axios";
import FadeIn from 'react-fade-in'
import { Offline, Online } from "react-detect-offline";

var ps;

class Dashboard extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "black",
      activeColor: "info",
    };
    this.mainPanel = React.createRef();
  }

  componentWillMount(){
    if(localStorage.getItem('tokn')){
      if(JSON.parse(localStorage.getItem('usr')).role === 1){
        this.props.history.replace("/user")
      }else{
        this.props.history.replace("/admin")
      }
      
    }else{
      localStorage.removeItem('tokn');
      localStorage.removeItem('usr')
      this.props.history.replace("/login")
    }
  }

  componentDidMount() {

    if(!localStorage.getItem('tokn')){
      this.props.history.replace("/login") 
    }
    // console.log(localStorage.getItem('usr'))

    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      this.mainPanel.current.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }
  handleActiveClick = (color) => {
    this.setState({ activeColor: color });
  };
  handleBgClick = (color) => {
    this.setState({ backgroundColor: color });
  };
  render() {
    return (
      <div className="wrapper">
        <Sidebar
          {...this.props}
          routes={sidebarRoutes}
          bgColor={this.state.backgroundColor}
          activeColor={this.state.activeColor}
          style={{fontSize:"16px"}}
        />
        <div className="main-panel" ref={this.mainPanel}>
          <DemoNavbar {...this.props} />
          <Offline>
            <FadeIn transitionDuration={1000}>
              <div className="bg-danger text-center text-white p-2 font-weight-bold">
                NO INTERNET CONNECTION
              </div>
            </FadeIn>
          </Offline>
          <Switch>
            {routes.map((item, key) => {        //prop => item
              return (
                <Route
                  exact path={item.layout + item.path}  
                  component={item.component}
                  key={key}
                />
              );
            })}
          </Switch>
          <Footer fluid />
        </div>
      </div>
    );
  }
}

export default Dashboard;
