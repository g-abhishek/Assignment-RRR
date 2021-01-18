
import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Label, Col, Row, Table, Button, Collapse, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { MDBDataTable } from 'mdbreact'
import { Control, Errors, LocalForm } from 'react-redux-form'
import Axios from 'axios';
import { store } from 'react-notifications-component';

const required = (val) => val && val.length;

class EmployeeProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            empId: this.props.match.params.id,
            isOpen: false,
            isModalOpen: false,
            callData: [],
            isCallDataReturned: false,
            empData: "",
            isEmpDataReturned: false,
        }
    }


    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }

    fetchEmpData = () => {

        Axios.get(`http://127.0.0.1:3005/employee/${this.state.empId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}`
            }
        }).then(response => {

            if (response.data.statusCode === 200) {

                console.log(response.data)

                this.setState({
                    empData: response.data.result,
                    isEmpDataReturned: true
                })
            }
            
        }).catch(error => {
            console.log(error)
        })

    }

    componentWillMount(){
        // this.fetchCallData();
        this.fetchEmpData();
    }

    fetchCallData = () => {

        Axios.get(`http://127.0.0.1:3005/employee/calldata/${this.state.empId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}`
            }
        }).then(response => {

            if (response.data.statusCode === 200) {

                console.log(response.data)

                let rowsData = []
                for (var i = 0; i < response.data.result.callHistory.length; i++) {
                    let rowItem = response.data.result.callHistory[i]
                    rowItem["changeStatus"] = <Button className="btn btn-danger py-2 px-3">&#10003;</Button>
                    rowItem["editBtn"] = <Button onClick={this.handleEdit} className="btn btn-info py-2 px-3"> &#x270E;</Button>

                    rowsData.push(rowItem)
                }

                console.log(rowsData)

                this.setState({
                    callData: rowsData.reverse(),
                    isCallDataReturned: true
                })
            }
            
        }).catch(error => {
            console.log(error)
        })
    } 

    handleSalarySubmit = (values) => {
        console.log(values)

        Axios.put(`http://127.0.0.1:3005/employee/salary/${this.state.empId}`, values, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}`
            }
        }).then(response => {
            if(response.data.statusCode === 401){
                store.addNotification({
                    title: "Not Found!",
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
                    message: "Payment Successful!",
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
                this.fetchEmpData();
                this.toggleModal()
                // document.getElementById("reset").click()
            }
            
        }).catch(error => {
            console.log(error)
            store.addNotification({
                title: "Error!",
                message: "Error While Payment!",
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
        const columnData = [
            {
                label: 'Salary',
                field: 'salary',
                sort: 'asc',
            },
            {
                label: 'Payment Date',
                field: 'paymentDate',
                sort: 'asc',
            },
            {
                label: 'Payment Type',
                field: 'paymentType',
                sort: 'asc',
            },
            {
                label: 'Comments',
                field: 'paymentComment',
            },
        ]
        return (
            <div className="content">
                <div>
                    <Card>
                        <CardHeader>
                            <h6>Profile Details</h6>
                            <hr />
                        </CardHeader>
                        <CardBody>
                            {this.state.isEmpDataReturned ? 
                                <Row>
                                    <Col>
                                        <Table borderless>
                                            <thead>
                                                <tr>
                                                    <td>
                                                        <h6>Full Name :</h6>
                                                    </td>
                                                    <td>{this.state.empData.fname} {this.state.empData.lname}</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>Contact :</h6>
                                                    </td>
                                                    <td>{this.state.empData.contact}</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>E-mail :</h6>
                                                    </td>
                                                    <td>{this.state.empData.email}</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>Gender :</h6>
                                                    </td>
                                                    <td>{this.state.empData.gender}</td>
                                                </tr>
                                            </thead>
                                        </Table>
                                    </Col>
                                    <Col>
                                        <Table borderless>
                                            <thead>
                                                <tr>
                                                    <td>
                                                        <h6>Main Street :</h6>
                                                    </td>
                                                    <td>{this.state.empData.street}</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>City :</h6>
                                                    </td>
                                                    <td>{this.state.empData.city}</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>Pincode :</h6>
                                                    </td>
                                                    <td>{this.state.empData.pincode}</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>State :</h6>
                                                    </td>
                                                    <td>{this.state.empData.state}</td>
                                                </tr>
                                            </thead>
                                        </Table>
                                    </Col>

                                </Row>
                            :<></>}

                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="m-0">Salary Logs</h6>
                                <div>
                                    <Button className="py-1" color="primary" onClick={this.toggle}>View Logs</Button>
                                    <Button className="ml-3 py-1" color="primary" onClick={this.toggleModal}><span style={{ fontSize: "16px" }}>&#xFF0B;</span> Make Payment</Button>
                                </div>

                            </div>

                            <hr />
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col>
                                    <Collapse isOpen={this.state.isOpen}>
                                            {/* <MDBDataTable
                                                hover
                                                bordered
                                                paging={false}
                                                data={{
                                                    columns: columnData,
                                                    rows: this.state.isEmpDataReturned ? this.state.empData.salaryHistory : []
                                                }}
                                                /> */}

                                                {this.state.isEmpDataReturned ? 
                                                    <table className="table table-bordered table-sm">
                                                        <thead className="thead-dark">
                                                            <tr>
                                                                <th scope="col">Sr no.</th>
                                                                <th scope="col">Salary</th>
                                                                <th scope="col">Date</th>
                                                                <th scope="col">Type</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.empData.salaryHistory.map((feeHist, idx)=>{
                                                                return(
                                                                    <tr>
                                                                        <th scope="row">{idx+1}</th>
                                                                        <td>{feeHist.salary} rs.</td>
                                                                        <td>{feeHist.paymentDate.substring(0,15)}</td>
                                                                        <td>{feeHist.paymentType}</td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                    
                                                    :<p>There is no data to show</p>}
                                            
                                    </Collapse>
                                </Col>
                            </Row>

                        </CardBody>
                    </Card>
                </div>


                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Salary</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSalarySubmit(values)}>
                            <Row className="form-group py-2">
                                <Col md={6}>
                                    <Label style={{ fontSize: "1.23em" }}>Date:</Label>
                                    <Control.text model=".salary" className="salary" id="salary"
                                        type="number"
                                        className="form-control"
                                        placeholder="Amount"
                                        validators = {{
                                            required
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".salary"
                                        show="touched"
                                        messages={{
                                            required: "Invalid Input"
                                        }}
                                    />
                                </Col>

                                <Col md={6}>
                                    <Label style={{ fontSize: "1.23em" }}>Payment Type:</Label>
                                    <Control.select model=".paymentType" id="paymentType" name="paymentType"
                                        defaultValue="Cash"
                                        className="form-control"
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Other">Other</option>
                                    </Control.select>
                                </Col>

                            </Row>

                            <Row className="form-group py-2">


                                <Col>
                                    <Label style={{ fontSize: "1.23em" }}>Comments:</Label>
                                    <Control.text model=".paymentComment" className="paymentComment" id="paymentComment"
                                        className="form-control"
                                        placeholder="Comment"
                                    />
                                </Col>
                            </Row>

                            <Row className="form-group">
                                <Col md={12}>
                                    <Button type="submit" outline block color="success" >
                                        Pay
                                    </Button>
                                </Col>
                            </Row>

                        </LocalForm>

                    </ModalBody>
                </Modal>



            </div>
        )
    }
}

export default EmployeeProfile;



