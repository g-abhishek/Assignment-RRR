import Axios from 'axios';
import React, { Component } from 'react'
import { store } from 'react-notifications-component';
import { Control, Errors, LocalForm } from 'react-redux-form'
import { Row, Col, Card, CardBody, Label, Button } from 'reactstrap'

const required = (val) => val && val.length;

class LeadRegistration extends Component {
    constructor(props){
        super(props)
        this.state = {
            submitDisabled: false,
            empoyeeData: [],
            isEmpoyeeDataReturned: false,
        }
    }

    componentWillMount(){
        Axios.get("http://127.0.0.1:3005/employee/get", {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}`
            }
        }).then(response => {

            if(response.data.statusCode === 200){
                this.setState({
                    empoyeeData: response.data.result,
                    isEmpoyeeDataReturned: true
                })
            }

        }).catch(error => {
            console.log(error)
        })
    }

    handleSubmit = (values) => {
        console.log(values)

        Axios.post("http://127.0.0.1:3005/lead/register", values, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}`
            }
        }).then(response => {
            if(response.data.statusCode === 400){
                store.addNotification({
                    title: "Already Exists!",
                    message: response.data.message,
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                      duration: 2000,
                      onScreen: true
                    }
                });
            }
            if(response.data.statusCode === 403){
                store.addNotification({
                    title: "Access Denied!",
                    message: response.data.message,
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                      duration: 2000,
                      onScreen: true
                    }
                });
            }
            if(response.data.statusCode === 200){
                store.addNotification({
                    title: "Success!",
                    message: "Registration Successful!",
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                      duration: 2000,
                      onScreen: true
                    }
                });
                document.getElementById("reset").click()
            }
            
        }).catch(error => {
            console.log(error)
            store.addNotification({
                title: "Error!",
                message: "Error While Registration!",
                type: "info",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                duration: 2000,
                onScreen: true
                }
            });
        })
    }

    render() {
        return (
            this.state.isEmpoyeeDataReturned ?
            <div className="content">
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody>
                                
                                <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                                    <h6>Personal Details</h6>
                                    <hr />
                                    <Row className="form-group py-2">
                                        <Col md={4}>
                                            <Label style={{fontSize:"1.23em"}}>First Name:</Label>
                                            <Control.text model=".fname" id="fname" name="fname"
                                                placeholder="First Name"
                                                className="form-control"
                                                validators = {{
                                                    required
                                                }}
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".fname"
                                                show = "touched"
                                                messages = {{
                                                    required : "This Fiels is Required"
                                                }}
                                            />
                                        </Col>

                                        
                                        <Col md={4}>
                                            <Label style={{fontSize:"1.23em"}}>Last Name:</Label>
                                            <Control.text model=".lname" id="lname" name="lname"
                                                placeholder="Last Name"
                                                className="form-control"
                                                validators = {{
                                                    required
                                                }}
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".lname"
                                                show = "touched"
                                                messages = {{
                                                    required : "This Fiels is Required"
                                                }}
                                            />
                                        </Col>

                                        
                                        <Col md={4}>
                                            <Label style={{fontSize:"1.23em"}}>Contact:</Label>
                                            <Control.text model=".contact" id="contact" name="contact"
                                                type="number"
                                                placeholder="Contact"
                                                className="form-control"
                                                validators = {{
                                                    required
                                                }}
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".contact"
                                                show = "touched"
                                                messages = {{
                                                    required : "This Fiels is Required"
                                                }}
                                            />
                                        </Col>
                                        
                                    </Row>

                                    <Row className="form-group py-2">  

                                                                             
                                        <Col md={4}>
                                            <Label style={{fontSize:"1.23em"}}>Email:</Label> 
                                            <Control.text model=".email" id="email" name="email"
                                                placeholder="First Name"
                                                className="form-control"
                                                validators = {{
                                                    required
                                                }}
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".email"
                                                show = "touched"
                                                messages = {{
                                                    required : "This Fiels is Required"
                                                }}
                                            />
                                        </Col>

                                        <Col md={4}>
                                            <Label style={{fontSize:"1.23em"}}>Gender:</Label> 

                                            <Control.select model=".gender" id="gender" name="gender"
                                                className="form-control" defaultValue="Male">
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>

                                            </Control.select>

                                        </Col>

                                    </Row>

                                    <hr />
                                    <h6>Address Details</h6>
                                    <hr />
                                    <Row className="form-group py-2">
                                        <Col md={4}>
                                            <Label style={{fontSize:"1.23em"}}>Main Street:</Label>
                                            <Control.text model=".street" id="street" name="street"
                                                placeholder="Main Street"
                                                className="form-control"
                                                validators = {{
                                                    required
                                                }}
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".street"
                                                show = "touched"
                                                messages = {{
                                                    required : "This Fiels is Required"
                                                }}
                                            />
                                        </Col>

                                        <Col md={4}>
                                            <Label style={{fontSize:"1.23em"}}>Pincode:</Label>
                                            <Control.text model=".pincode" id="pincode" name="pincode"
                                                type="number"
                                                placeholder="Pincode"
                                                className="form-control"
                                                validators = {{
                                                    required
                                                }}
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".pincode"
                                                show = "touched"
                                                messages = {{
                                                    required : "This Fiels is Required"
                                                }}
                                            />
                                        </Col>

                                        <Col md={4}>
                                            <Label style={{fontSize:"1.23em"}}>City:</Label>
                                            <Control.text model=".city" id="city" name="city"
                                                placeholder="City"
                                                className="form-control"
                                                validators = {{
                                                    required
                                                }}
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".city"
                                                show = "touched"
                                                messages = {{
                                                    required : "This Fiels is Required"
                                                }}
                                            />
                                        </Col>

                                    </Row>
                                    
                                    <Row className="form-group py-2">

                                        <Col md={4}>
                                            <Label style={{fontSize:"1.23em"}}>State:</Label>
                                            <Control.text model=".state" id="state" name="state"
                                                placeholder="State"
                                                className="form-control"
                                                validators = {{
                                                    required
                                                }}
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".state"
                                                show = "touched"
                                                messages = {{
                                                    required : "This Fiels is Required"
                                                }}
                                            />
                                        </Col>

                                        <Col md={4}>
                                            <Label style={{fontSize:"1.23em"}}>Address of:</Label>
                                            <Control.select model=".addressOf" id="addressOf" name="addressOf"
                                                className="form-control" defaultValue="House">
                                                    <option value="House">House</option>
                                                    <option value="shop">shop</option>

                                            </Control.select>
                                        </Col>

                                        
                                        
                                        
                                    </Row>

                                    <hr />
                                    <h6>Lead Details</h6>
                                    <hr />
                                    <Row className="form-group py-2">
                                        <Col md={4}>
                                            <Label style={{fontSize:"1.23em"}}>Lead Source:</Label>
                                            <Control.text model=".leadSource" id="leadSource" name="leadSource"
                                                placeholder="Lead Source"
                                                className="form-control"
                                                validators = {{
                                                    required
                                                }}
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".leadSource"
                                                show = "touched"
                                                messages = {{
                                                    required : "This Fiels is Required"
                                                }}
                                            />
                                        </Col>

                                        <Col md={4}>
                                            <Label style={{fontSize:"1.23em"}}>Lead Type:</Label>
                                            <Control.select model=".leadType" id="leadType" name="leadType"
                                                className="form-control" defaultValue="New">
                                                    <option value="New">New</option>
                                                    <option value="Old">Old</option>

                                            </Control.select>
                                        </Col>

                                        <Col md={4}>
                                            <Label style={{fontSize:"1.23em"}}>Status:</Label>
                                            <Control.select model=".leadStatus" id="leadStatus" name="leadStatus"
                                                className="form-control" defaultValue="Lead">
                                                    <option value="Lead">Lead</option>
                                                    <option value="Client">Client</option>

                                            </Control.select>
                                        </Col>

                                    </Row>
                                    
                                    <Row className="form-group py-2">

                                        
                                        <Col md={4}>
                                            <Label style={{fontSize:"1.23em"}}>Assigned to:</Label>
                                            <Control.select model=".assignedTo" id="assignedTo" name="assignedTo"
                                                className="form-control" defaultValue={JSON.stringify(this.state.empoyeeData[0])}>
                                                    {this.state.empoyeeData.map((item, idx)=>{
                                                        return (
                                                            <option value={JSON.stringify(item)}>{item.fname} {item.lname}</option>
                                                        )
                                                    })}
                                                    

                                            </Control.select>
                                        </Col>

                                        
                                        <Col md={4}>
                                            <Label style={{fontSize:"1.23em"}}>Representative:</Label> 
                                            <Control.text model=".representative" id="representative" name="representative"
                                                placeholder="Representative"
                                                className="form-control"
                                                defaultValue = {JSON.parse(localStorage.getItem("usr")).name}
                                                validators = {{
                                                    required
                                                }}
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".representative"
                                                show = "touched"
                                                messages = {{
                                                    required : "This Fiels is Required"
                                                }}
                                            />

                                        </Col>

                                        <Col md={4}>
                                            <Label style={{fontSize:"1.23em"}}>Follow Up date:</Label>
                                            <Control.text model=".followUpDate" id="followUpDate" name="followUpDate"
                                                type="date"
                                                placeholder="Follow Up Date"
                                                className="form-control"
                                                validators = {{
                                                    required
                                                }}
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".followUpDate"
                                                show = "touched"
                                                messages = {{
                                                    required : "This Fiels is Required"
                                                }}
                                            />
                                        </Col>
                                        
                                    </Row>

                                    <Row className="form-group py-2">

                                        
                                        <Col md={12}>
                                            <Control.text model=".description" id="description" name="description"
                                                placeholder="Requirements / Description"
                                                className="form-control"
                                                validators = {{
                                                    required
                                                }}
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".description"
                                                show = "touched"
                                                messages = {{
                                                    required : "This Fiels is Required"
                                                }}
                                            />
                                        </Col>                                        
                                        
                                    </Row>

                                    <Row className="form-group">
                                        <Col md={6}>
                                            <Button color="danger" id="reset" block type="reset">Reset</Button>
                                        </Col>
                                        <Col md={6}>
                                            <Button type="submit" outline block color="success" disabled={this.state.submitDisabled}>
                                                Register
                                            </Button>
                                        </Col>
                                    </Row>
                                                
                                </LocalForm>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
            : <></>
        )
    }
}

export default LeadRegistration;
