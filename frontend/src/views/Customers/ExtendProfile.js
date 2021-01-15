import Axios from 'axios'
import React from 'react'
import { store } from 'react-notifications-component'
import { Control, Errors, LocalForm } from 'react-redux-form'
import {Link} from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem, Button, Card, CardBody, CardHeader, Col, Label, Row } from 'reactstrap'
import $ from 'jquery'
import Swal from 'sweetalert2'


const required = (val) => val && val.length;
const isMobileNumber = (val) => !isNaN(Number(val)) && (val).toString().length == 10 && Number(val) > 0 && Number.isInteger(Number(val));
const isNumber = (val) => !isNaN(Number(val)) && (val).toString().length >0 && Number(val) > 0 && Number.isInteger(Number(val));

class ExtendProfile extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            id: this.props.match.params.id,
            data: [],
            endDate: "",
            extendEndDate: "",
            isDataReturned: false,
            submitDisabled: false
        }
    }
    
    getUserData =()=> {

        Axios.get(`https://fittzee-backend.herokuapp.com/customer/freeze/fetch/${this.state.id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}` 
            } 
        }).then(dataReceived => {
            console.log(dataReceived)
            if(dataReceived.data.statusCode == 403){
                store.addNotification({
                    title: "Invalid Id",
                    message: dataReceived.data.message,
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
                this.props.history.replace('/admin/freeze')
            }
            if(dataReceived.data.statusCode == 404){
                store.addNotification({
                    title: "Invalid Id",
                    message: dataReceived.data.message,
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
                this.props.history.replace('/admin/freeze')
            }
            if(dataReceived.data.statusCode == 200){
                this.setState({
                    data: dataReceived.data.result[0],
                    endDate: dataReceived.data.result[0].packages? dataReceived.data.result[0].packages.endDate : "",
                    isDataReturned: true
                })
            }
        }).catch(error => {
            store.addNotification({
                title: "Error",
                message: "Enable to Fetch Data",
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

    componentDidMount(){
        this.getUserData()
    }

    handleSubmit = (values) => {

        console.log(values)

        const body = {
            extendDays: values.extendDays,
            extendReason: values.extendReason,
            endDate: this.state.extendEndDate,
            user: localStorage.getItem('usr'),
        }

        console.log(body)

        Swal.fire({
            title: 'Confirm Extend?',
            text: 'Are you sure to Extend?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
          }).then((result) => {
            if (result.value) {

                this.setState({
                    submitDisabled: true
                })

                Axios.put(`https://fittzee-backend.herokuapp.com/customer/extend/${this.state.id}`, body, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('tokn')}` 
                    } 
                })  
                .then((response) => {
                    this.setState({
                        submitDisabled: false
                    })
                    // setResponse(response.data);
                    console.log("Response");
                    console.log(response)
                    if (response.data.statusCode === 403) {
                        // Swal.fire( response.data.message )
                        store.addNotification({
                            title: "Invalid Id!",
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
                        console.log("Created");
                        store.addNotification({
                            title: "Success!",
                            message: "Extended Successful!",
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

                        // Resset the form!
                        document.getElementById("extend-form").reset();
                        
                        
                        this.setState({
                            data: [],
                            endDate: "",
                            extendEndDate: "",
                            isDataReturned: false,
                        })

                        this.getUserData()
                    }
                    
                }).catch((error) => {
                    this.setState({
                        submitDisabled: false
                    })
                    console.log("error");
                    console.log(error.status)
                    store.addNotification({
                        title: "Error!",
                        message: "Error While Extending!",
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
                    title: "Cancelled!",
                    message: "Cancelled Succesfully!",
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
            }
        })

        
    }

    endDateChange = (e) => {

        
        console.log(e.target.value)
        let d = new Date(this.state.endDate);
        d.setDate(new Date(this.state.endDate).getDate() + parseInt(e.target.value));

        let pendDate = new Date(d);
        let dd = pendDate.getDate();
        let mm = pendDate.getMonth() + 1;
        let yyyy = pendDate.getFullYear();
        if (dd < 10) {
            dd = `0${dd}`;
        }
        if (mm < 10) {
            mm = `0${mm}`;
        }
        let packageEndDate = `${yyyy}-${mm}-${dd}`;
        console.log(packageEndDate);
        
        this.setState({
            extendEndDate: packageEndDate
        })
    }



    render(){
        return(
            <div className="content">
                <Breadcrumb>
                    <BreadcrumbItem><Link to='/'>Home</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to='/admin/extend/'>Extend</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Profile</BreadcrumbItem>
                </Breadcrumb>

                <div>
                    <Row>
                        <Col md={6}>
                            <Card>
                                <CardHeader>
                                    <h6>Profile Details {this.state.data.freezed? <span className="text-info">Freezed</span> :""}</h6>
                                </CardHeader>
                                <CardBody className="my-3">
                                    {this.state.isDataReturned? 
                                        <div>
                                            <Row className="align-items-center mb-5">
                                                <Col md="3">
                                                    <div className="flip-box-front">
                                                        <img
                                                            alt=""
                                                            className="rounded-circle img-fluid img-raised mx-auto d-block"
                                                            src = { this.state.data.profilePic !== null ? `https://fittzee-backend.herokuapp.com/resized/${this.state.data.profilePic}` : require('./../../assets/img/default-avatar.png')}
                                                            style={{width:"90px", height:"90px", overflow:"hidden",maxWidth:"100%",borderRadius:"100%", maxHeight:"100%"}}
                                                        ></img>
                                                    </div>
                                                </Col>
                                                <Col md="9">
                                                    <div className="d-flex align-items-baseline mb-2">
                                                        <h6 className="mb-0 mr-2">Name:</h6>
                                                        <p className="mb-0">{this.state.data.customerName}</p>
                                                    </div>
                                                    <div className="d-flex mb-2">
                                                        <div className="d-flex align-items-baseline mr-4">
                                                            <h6 className="mb-0 mr-2">Gender:</h6>
                                                            <p className="mb-0">{this.state.data.gender}</p>
                                                        </div>
                                                        <div className="d-flex align-items-baseline">
                                                            <h6 className="mb-0 mr-2">Mobile:</h6>
                                                            <p className="mb-0">{this.state.data.mobile}</p>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-baseline">
                                                        <h6 className="mb-0 mr-2">Address:</h6>
                                                        <p className="mb-0">{this.state.data.address}</p>
                                                    </div>
                                                 </Col>
                                            </Row>

                                            {this.state.data.packages && this.state.data.payments? 
                                                <div>
                                                    <div className="d-flex align-items-baseline mb-2">
                                                        <h6 className="mb-0 mr-2">Package:</h6>
                                                        <p className="mb-0">{this.state.data.packages.packageName} ( {this.state.data.packages.description} )</p>
                                                    </div>
                                                    <div className="d-flex mb-2">
                                                        <div className="d-flex align-items-baseline mr-4">
                                                            <h6 className="mb-0 mr-2">Start Date:</h6>
                                                            <p className="mb-0">{this.state.data.packages.startDate}</p>
                                                        </div>
                                                        <div className="d-flex align-items-baseline mr-4">
                                                            <h6 className="mb-0 mr-2">End Date:</h6>
                                                            <p className="mb-0">{this.state.data.packages.endDate}</p>
                                                        </div>
                                                        <div className="d-flex align-items-baseline">
                                                            <h6 className="mb-0 mr-2">Days:</h6>
                                                            <p className="mb-0">{this.state.data.packages.totalDays}</p>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex mb-2">
                                                        <div className="d-flex align-items-baseline mr-4">
                                                            <h6 className="mb-0 mr-2">Total Amount:</h6>
                                                            <p className="mb-0">{this.state.data.packages.totalAmount}</p>
                                                        </div>
                                                        <div className="d-flex align-items-baseline">
                                                            <h6 className="mb-0 mr-2">Pending Amount:</h6>
                                                            <p className="mb-0 text-danger font-weight-bold">{this.state.data.payments.feesHistory[0].pendingAmount}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            : <></>}
                                        </div>
                                    :<></>}
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card>
                                <CardHeader>
                                    <h6>Extending Details</h6>
                                </CardHeader>
                                <CardBody className="my-3">
                                    <LocalForm id="extend-form" onSubmit={(values) => this.handleSubmit(values)}>
                                        <Row className="form-group mb-3">
                                            <Label md={2} style={{fontSize:"1.23em"}}>Days:</Label>  
                                            <Col md={3}>
                                                <Control.text type="number" model=".extendDays" id="extendDays" name="extendDays"
                                                    placeholder="No.of days to extend"   
                                                    className="form-control"   
                                                    onChange= {this.endDateChange}  
                                                    disabled={this.state.data.packages? false: true} 
                                                    validators={{
                                                        isNumber
                                                    }}                                          
                                                />
                                                <Errors 
                                                    className="text-danger"
                                                    model=".extendDays"
                                                    show="touched"
                                                    messages={{
                                                        isNumber: 'Invalid Input!',
                                                    }}

                                                />

                                            </Col>   
                                            <Col>
                                                <Control.text model=".endDate" id="endDate" name="endDate"
                                                    // defaultValue= {this.state.data.packages && this.state.data.payments? this.state.data.packages.endDate :"End Date"}
                                                    value= {this.state.data.packages && this.state.extendEndDate !== "NaN-NaN-NaN"? this.state.extendEndDate :"End Date"}
                                                    placeholder="End Date"   
                                                    className="form-control"      
                                                    disabled                                         
                                                />

                                            </Col>   
                                        </Row>
                                        <Row className="form-group mb-3">                                           
                                            <Col>
                                                <Control.textarea model=".extendReason" id="extendReason" name="extendReason"
                                                    placeholder="Reason to Extend"   
                                                    className="form-control"                                   
                                                />
                                            </Col>
                                        </Row>
                                        
                                        <Row>
                                            <Col md={12}>
                                                    {this.state.data.freezed?   
                                                        <Button type="submit" block outline color="primary" disabled>
                                                            Already Freezed
                                                        </Button>
                                                    :   
                                                        <Button type="submit" block outline color="primary" disabled={this.state.submitDisabled}>
                                                            Submit
                                                        </Button>                                                    
                                                    }
                                                    
                                                    
                                                </Col>
                                            </Row>
                                    </LocalForm>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>


            </div>
        )
    }
}

export default ExtendProfile;