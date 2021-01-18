import React, { Component } from "react";
import axios from 'axios'

import {Control, LocalForm, Errors } from 'react-redux-form';
//import { Link } from 'react-router-dom';
import {Button,  Card,  CardBody,  CardGroup,  Col,  Container, Row } from "reactstrap";
// import {store} from 'react-notifications-component';
import { store } from 'react-notifications-component';
import { Link } from "react-router-dom";

const required = (val) => val && val.length;
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val)



class LoginPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      adminLogin : false
    }
  }

  componentWillMount(){
    if(localStorage.getItem('tokn')){
      if(JSON.parse(localStorage.getItem('usr')).role === 0){
        this.props.history.replace("/admin/dashboard")
      }else{
        this.props.history.replace("/employee/dashboard")
      }
      
    }else{
      localStorage.removeItem('tokn');
      localStorage.removeItem('usr')
      this.props.history.replace("/login")
    }
  }

  handleUserSubmit = (values) => {


      axios.post(`http://127.0.0.1:3005/employee/login`,{
            email: values.email,
            password: values.password
        })
        .then(response => {

          console.log("Response is - ")
          console.log(response)

          if( response.data.statusCode === 404){
            store.addNotification({
              title: "Login Error!",
              message: "Invalid UserName or Password",
              type: "danger",
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 3000,
                onScreen: true
              }
            });
          }
          
          if(response.data.statusCode === 200 ){

            console.log(response.data.token)
            localStorage.setItem('tokn', response.data.token)
            localStorage.setItem('usr', JSON.stringify(response.data.user))
            this.props.history.replace('/employee/dashboard')
            
          }

        }).catch(error => {      
            console.log("catch err is ");
            console.log(error)  

            store.addNotification({
              title: "Login Error!",
              message: "Invalid UserName and Password",
              type: "danger",
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 3000,
                onScreen: true
              }
            });
            
     
   });

  }

  handleAdminSubmit = (values) => {

    console.log(values)

    axios.post(`http://127.0.0.1:3005/admin/login`,{
          email: values.email,
          password: values.password
      })
      .then(response => {

          console.log("Response is - ")
          console.log(response)

          if( response.data.statusCode === 404){
            store.addNotification({
              title: "Login Error!",
              message: "Invalid UserName or Password",
              type: "danger",
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 3000,
                onScreen: true
              }
            });
          }
          
          if(response.data.statusCode === 200 ){

            console.log(response.data.token)
            localStorage.setItem('tokn', response.data.token)
            localStorage.setItem('usr', JSON.stringify(response.data.user))
            this.props.history.replace('/admin/dashboard')
            
          }

      }).catch(error => {      
          console.log("catch err is ");
          console.log(error)  

          store.addNotification({
            title: "Login Error!",
            message: "Invalid UserName and Password",
            type: "danger",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 3000,
              onScreen: true
            }
          });
          
   
 });

}

onChangeHandler = () => {
  this.setState({
    adminLogin : !this.state.adminLogin
  })
}


  render() {

    let adminLoginView = (
      <Card className="p-3" style={{border:"2px solid #51cbce"}}>
      <CardBody>
          <h4 className="mb-0 mt-0 font-weight-bold">Admin Login</h4>
          <hr style={{border:"1px solid #51cbce"}}/>
          <p className="">Please Sign In to your account:</p>
                      
                   
                
        <LocalForm onSubmit={(values) => this.handleAdminSubmit(values)}>
          <Row className="form-group">
              <Col md={12}>
                  <Control.text model=".email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      className="form-control"
                      validators={{
                        validEmail
                      }} 
                  />
                  <Errors 
                      className="text-danger"
                      show="touched"
                      model=".email"
                      messages={{
                        validEmail: 'Invalid Email'
                      }}
                  />
              </Col>
          </Row>
          <Row className="form-group">
              <Col md={12}>
                  <Control.password model=".password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      className="form-control"
                      validators={{
                          required
                      }} 
                  />
                  <Errors 
                      className="text-danger"
                      show="touched"
                      model=".password"
                      messages={{
                          required: 'This is a Required Field!'
                      }}
                  />
              </Col>
          </Row>
          <Row className="form-group">
              <Col md={{size: 10}}>                                 
                  <a onClick={this.onChangeHandler} className="font-weight-bold text-info" style={{cursor:"pointer"}}>Go to User Login</a>
                  <Button type="submit" color="outline-primary">
                      Login
                  </Button>
              </Col>
              
          </Row>
      </LocalForm>
      </CardBody>
    </Card>
    )

    
    let userLoginView = (
      <Card className="p-3" style={{border:"2px solid #51cbce"}}>
        <CardBody>
            <h4 className="mb-0 mt-0 font-weight-bold">User Login</h4>
            <hr style={{border:"1px solid #51cbce"}}/>
            <p className="">Please Sign In to your account:</p>
                        
                     
                  
          <LocalForm onSubmit={(values) => this.handleUserSubmit(values)}>
            <Row className="form-group">
                <Col md={12}>
                    <Control.text model=".email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        className="form-control"
                        defaultValue="sagar@gmail.com"
                        validators={{
                          validEmail
                        }} 
                    />
                    <Errors 
                        className="text-danger"
                        show="touched"
                        model=".email"
                        messages={{
                          validEmail: 'Invalid Email'
                        }}
                    />
                </Col>
            </Row>
            <Row className="form-group">
                <Col md={12}>
                    <Control.password model=".password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        className="form-control"
                        defaultValue="password1234"
                        validators={{
                            required
                        }} 
                    />
                    <Errors 
                        className="text-danger"
                        show="touched"
                        model=".password"
                        messages={{
                            required: 'This is a Required Field!'
                        }}
                    />
                </Col>
            </Row>
            <Row className="form-group">
                <Col md={{size: 10}}>                                  
                    <a onClick={this.onChangeHandler} className="font-weight-bold text-info" style={{cursor:"pointer"}}>Go to admin Login</a>
                    <Button type="submit" color="outline-primary">
                        Login
                    </Button>
                </Col>
                
            </Row>
        </LocalForm>
        </CardBody>
      </Card>
    )


    return (
      <div className="app bg-dark d-flex align-items-center vh-100">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <CardGroup>
                
                {this.state.adminLogin ? adminLoginView: userLoginView}
                <Card className="d-none d-lg-block bg-primary">
                  <CardBody className="text-white m-3">
                    <h3 className="font-weight-bold">Assignment</h3>
                    <hr style={{border:"1px solid #fff"}}/>
                    <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century</p>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default LoginPage;
