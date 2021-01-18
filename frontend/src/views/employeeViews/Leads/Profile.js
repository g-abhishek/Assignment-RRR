
import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Label, Col, Row, Table, Button, Collapse, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { MDBDataTable } from 'mdbreact'
import { Control, Errors, LocalForm } from 'react-redux-form'
import Axios from 'axios';
import { store } from 'react-notifications-component';
import Swal from 'sweetalert2';

const required = (val) => val && val.length;

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: this.props.match.params.id,
            isOpen: false,
            isModalOpen: false,
            callData: [],
            isCallDataReturned: false,
            userData: "",
            isUserDataReturned: false,
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

    fetchUserData = () => {

        Axios.get(`http://127.0.0.1:3005/lead/${this.state.userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}`
            }
        }).then(response => {

            if (response.data.statusCode === 200) {

                console.log(response.data)

                this.setState({
                    userData: response.data.result,
                    isUserDataReturned: true
                })
            }
            
        }).catch(error => {
            console.log(error)
        })

    }

    fetchCallHistory = () => {

        Axios.get(`http://127.0.0.1:3005/lead/fetch/callhistory/${this.state.userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}`
            }
        }).then(response => {

            if (response.data.statusCode === 200) {

                console.log(response.data)

                this.setState({
                    userData: response.data.result,
                    isUserDataReturned: true
                })
            }
            
        }).catch(error => {
            console.log(error)
        })

    }

    componentWillMount(){
        this.fetchCallData();
        this.fetchUserData();
    }

    fetchCallData = () => {

        Axios.get(`http://127.0.0.1:3005/lead/calldata/${this.state.userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}`
            }
        }).then(response => {

            if (response.data.statusCode === 200) {

                console.log(response.data)

                let rowsData = []
                for (var i = 0; i < response.data.result.callHistory.length; i++) {
                    let rowItem = response.data.result.callHistory[i]
                    rowItem["changeStatus"] = <Button onClick={() => this.handleChangeStatus(rowItem._id)} className="btn btn-success py-2 px-3">&#10003;</Button>
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

    handleCallSubmit = (values) => {
        console.log(values)

        Axios.put(`http://127.0.0.1:3005/lead/addcall/${this.state.userId}`, values, {
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
                this.fetchCallData();
                this.toggleModal()
                // document.getElementById("reset").click()
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

    handleConvert = (id) => {
        console.log(id)     

        Swal.fire({
            title: "Change Status?",
            text: "Are you sure you want change the status?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes. Change it!",
            cancelButtonText: "Cancel, keep it"
        }).then(result => {
            if (result.value) {


                Axios.put(`http://127.0.0.1:3005/lead/change/call/status/`, { id: id }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('tokn')}`
                    }
                }).then(response => {
                    console.log(response)

                    if(response.data.statusCode === 401){
                        store.addNotification({
                            title: "Failed!",
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

                    if (response.data.statusCode === 200) {
                        console.log(response)
                        store.addNotification({
                            title: "Success!",
                            message: "Converted Successfully!",
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
                    }

                }).catch(error => {
                    console.log(error)
                    store.addNotification({
                        title: "Error!",
                        message: "Internal Server Error!",
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

            } else if (result.dismiss === Swal.DismissReason.cancel) {
                store.addNotification({
                    title: 'Cancelled!',
                    message: 'Cancelled Successfully',
                    type: 'info',
                    insert: 'top',
                    container: 'top-right',
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                        duration: 2000,
                        onScreen: true
                    }
                })
            }
        })


    }

    render() {
        const columnData = [
            {
                label: 'Status',
                field: 'callStatus',
                sort: 'asc',
            },
            {
                label: 'Date',
                field: 'nextCallDate',
                sort: 'asc',
            },
            {
                label: 'Description',
                field: 'description',
                sort: 'asc',
            },
            {
                label: 'Change Status',
                field: 'changeStatus',
            },
            {
                label: 'Edit',
                field: 'editBtn',
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
                            {this.state.isUserDataReturned ? 
                                <Row>
                                    <Col>
                                        <Table borderless>
                                            <thead>
                                                <tr>
                                                    <td>
                                                        <h6>Full Name :</h6>
                                                    </td>
                                                    <td>{this.state.userData.fname} {this.state.userData.lname}</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>Contact :</h6>
                                                    </td>
                                                    <td>{this.state.userData.contact}</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>E-mail :</h6>
                                                    </td>
                                                    <td>{this.state.userData.email}</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>Gender :</h6>
                                                    </td>
                                                    <td>{this.state.userData.gender}</td>
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
                                                    <td>{this.state.userData.street}</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>City :</h6>
                                                    </td>
                                                    <td>{this.state.userData.city}</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>Pincode :</h6>
                                                    </td>
                                                    <td>{this.state.userData.pincode}</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>State :</h6>
                                                    </td>
                                                    <td>{this.state.userData.state}</td>
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
                                <h6 className="m-0">Call Logs</h6>
                                <div>
                                    <Button className="py-1" color="primary" onClick={this.toggle}>View Logs</Button>
                                    <Button className="ml-3 py-1" color="primary" onClick={this.toggleModal}><span style={{ fontSize: "16px" }}>&#xFF0B;</span> Add</Button>
                                </div>

                            </div>

                            <hr />
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col>
                                    <Collapse isOpen={this.state.isOpen}>
                                            <MDBDataTable
                                                hover
                                                bordered
                                                paging={false}
                                                data={{
                                                    columns: columnData,
                                                    rows: this.state.isCallDataReturned ? this.state.callData : []
                                                }}
                                            />
                                    </Collapse>
                                </Col>
                            </Row>

                        </CardBody>
                    </Card>
                </div>


                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Add Call</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleCallSubmit(values)}>
                            <Row className="form-group py-2">
                                <Col md={6}>
                                    <Label style={{ fontSize: "1.23em" }}>Date:</Label>
                                    <Control.text model=".nextCallDate" id="nextCallDate" name="nextCallDate"
                                        type="date"
                                        className="form-control"
                                        validators={{
                                            required
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".nextCallDate"
                                        show="touched"
                                        messages={{
                                            required: "This Fiels is Required"
                                        }}
                                    />
                                </Col>

                                <Col md={6}>
                                    <Label style={{ fontSize: "1.23em" }}>Call Status:</Label>

                                    <Control.select model=".callStatus" id="callStatus" name="callStatus"
                                        className="form-control" defaultValue="Pending">
                                        <option value="Pending">Pending</option>
                                        <option value="Done">Done</option>
                                    </Control.select>

                                </Col>

                            </Row>

                            <Row className="form-group py-2">


                                <Col>
                                    <Label style={{ fontSize: "1.23em" }}>Description:</Label>
                                    <Control.textarea model=".description" id="description" name="description"
                                        placeholder="Description / Notes"
                                        className="form-control"
                                        validators={{
                                            required
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".description"
                                        show="touched"
                                        messages={{
                                            required: "This Fiels is Required"
                                        }}
                                    />
                                </Col>
                            </Row>

                            <Row className="form-group">
                                <Col md={12}>
                                    <Button type="submit" outline block color="success" >
                                        Add Call
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

export default Profile;
