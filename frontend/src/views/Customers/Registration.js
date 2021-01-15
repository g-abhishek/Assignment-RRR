import React, { Component } from 'react';
import { Card,CardHeader,CardBody,CardFooter,CardTitle,Row,Col,Button, Badge, Breadcrumb, BreadcrumbItem, Label,  Modal,ModalHeader, ModalBody,ModalFooter, Table} from "reactstrap";
import { Link } from "react-router-dom";
import axios from 'axios'
import { Control, LocalForm, Errors } from 'react-redux-form';

import { MDBDataTableV5 } from 'mdbreact';
import $ from 'jquery'

import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

import Swal from 'sweetalert2'
// const override = css`
//   filter: blur(-3px);
  
// `;

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len)
const minLength = (len) => (val) => (val) && (val.length >= len)
const isMobileNumber = (val) => !isNaN(Number(val)) && (val).toString().length == 10 && Number(val) > 0 && Number.isInteger(Number(val));
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val)
const isNumber = (val) => !isNaN(Number(val)) && (val).toString().length >0 && Number(val) > 0 && Number.isInteger(Number(val));

function WithCheckBoxesEnd(props) {

    const [datatable, setDatatable] = React.useState({
      columns: props.columns,
      rows: props.rows
    });
  
  
    const [checkbox1, setCheckbox1] = React.useState('');
  
    const showLogs2 = (e) => {
      setCheckbox1(e);
      props.handleSelect(e)
    };
  
    return (
      <>
        {/* <MDBDataTable
          hover
          bordered
          small
          data={datatable}
        /> */}
        <MDBDataTableV5
          hover
          bordered
          entriesOptions={[10, 20, 25]}
          entries={10}
          pagesAmount={4}
          data={datatable}
          checkbox
          headCheckboxID='id4'
          bodyCheckboxID='checkboxes4'
          getValueCheckBox={(e) => {
            showLogs2(e);
          }}
        />
      </>
    );
  }

class Registration extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen: false,
            packageData: [],
            isDataReturned: false,
            selectedPackage: {},
            startDate: '',
            endDate: '',
            totalDays: '',
            totalAmount: '',
            givenAmount: '',
            pendingAmount: '',
            src : require('./../../assets/img/default-avatar.png'),
            selectedFile:null,
            packageForm: false,
            submitDisabled: false
        }
    }

    handleImageUpload = (e) => {
        e.preventDefault();
        console.log(e.target.files[0])
        if(!e.target.files[0]){
            this.setState({
                src:  require('./../../assets/img/default-avatar.png'),
                selectedFile: null
            });
            return
        }
        this.setState({
            src: URL.createObjectURL(e.target.files[0]),
            selectedFile: e.target.files[0]
        });
        console.log(e.target.files[0])
    }

    toggleModal = () =>{
        this.setState({isModalOpen: !this.state.isModalOpen})
    }


    handleSelect = (obj) => {
        this.setState({
            selectedPackage: obj,
            packageForm: true,
            startDate: '',
            endDate: '',
            totalDays: '',
            totalAmount: '',
            givenAmount: '',
            pendingAmount: '',
        })
    }

    resetPackageForm = (e) =>{
        e.preventDefault()
        document.getElementById("registrationForm").reset();
        document.getElementById("picture").value = "";
        this.setState({
            src:  require('./../../assets/img/default-avatar.png'),
            selectedFile: null,
            selectedPackage: {},
            packageForm: false,
            startDate: '',
            endDate: '',
            totalDays: '',
            totalAmount: '',
            givenAmount: '',
            pendingAmount: '',
        })
    }
    

    getPackageData = async() => {
        const dataReceived = await axios.get(`https://fittzee-backend.herokuapp.com/package`)

        console.log(dataReceived)

        this.setState({
            packageData: dataReceived.data,
            isDataReturned: true
        })
    }

    componentWillMount = async() => {
        await this.getPackageData();
    }

    handleSubmit = (values) => {

        this.setState({
            submitDisabled: true
        })

        console.log(values)

        if(JSON.stringify(this.state.selectedPackage) === '{}' && this.state.packageForm === false){
            store.addNotification({
                title: "Error",
                message: "Please select package",
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
              this.setState({
                submitDisabled: false
            })
            
            return
        }

        const body = {
            customerName: values.customerName,
            gender: values.gender,
            address: values.address,
            mobile: values.mobile,
            email: values.email,
            dob: values.dob,

            packageName: this.state.selectedPackage.packageName,
            description: this.state.selectedPackage.description,
            type: this.state.selectedPackage.type,
            months: this.state.selectedPackage.months,
            packageAmount: this.state.selectedPackage.fees,
            totalAmount: this.state.totalAmount,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            totalDays: this.state.totalDays,
            givenAmount: this.state.givenAmount,
            pendingAmount: this.state.pendingAmount,
            paymentType: values.paymentType,
            trainer: values.trainer,
            paymentComment: values.paymentComment,

            pending: this.state.givenAmount === this.state.totalAmount ? false : true,
            user: localStorage.getItem('usr'),
        }

        const formData = new FormData();
        formData.append("values", JSON.stringify(body));
        formData.append("file", this.state.selectedFile);

        console.log(body)

        axios.post(`https://fittzee-backend.herokuapp.com/customer/registration`, formData, {
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
            if (response.data.statusCode === 200) {
                console.log("Created");
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

                // Resset the form!
                document.getElementById("resetBtn").click();
                
                this.setState({src: require('./../../assets/img/default-avatar.png')});
                document.getElementById('picture').value = '';
                $('#gender').val('Male');
                this.setState({
                    selectedPackage: {},
                    startDate: '',
                    endDate: '',
                    totalDays: '',
                    totalAmount: '',
                    givenAmount: '',
                    pendingAmount: '',
                })
            }
            
        }).catch((error) => {
            this.setState({
                submitDisabled: false
            })
            console.log("error");
            console.log(error.status)
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

    // onSelectedOption =(e)=>{
    //     this.setState({
    //         package_amount: parseInt($(e.target.options[e.target.selectedIndex]).attr("data-amount")),
    //         otp: $(e.target.options[e.target.selectedIndex]).attr("data-otp"),
    //     })
    // }


    onChange =(e) =>{
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    amountChange =(e) =>{
        this.setState({
            [e.target.name] : e.target.value,
            pendingAmount: this.state.totalAmount - this.state.givenAmount
        })
    }

    dateChange = (e) => {
        this.setState({
            startDate: e.target.value,
        }, this.setEndDate)
    }

    setEndDate = () => {
        let days = parseInt(this.state.selectedPackage.months) * 30;
        let endDate = new Date(this.state.startDate).setDate(new Date(this.state.startDate).getDate() + days);
        // debugger;
        console.log(endDate)
        let pendDate = new Date(endDate);
        console.log(pendDate)
        let dd = pendDate.getDate();
        let mm = pendDate.getMonth() + 1;
        const yyyy = pendDate.getFullYear();
        if (dd < 10) {
            dd = `0${dd}`;
        }
        if (mm < 10) {
            mm = `0${mm}`;
        }
        let packageEndDate = `${yyyy}-${mm}-${dd}`;
        console.log(packageEndDate);
        this.setState({
            endDate : packageEndDate,
            totalDays: days
        })
    }



    render() { 

        const columns = [
            {
              label: 'Name',
              field: 'packageName',
              sort: 'asc'
      
            },
            {
              label: 'Months',
              field: 'months',
              sort: 'asc'
            },
            {
              label: 'Fees',
              field: 'fees',
              sort: 'asc'
            },
            {
              label: 'Type',
              field: 'type',
              sort: 'asc'
            },
            {
              label: 'Description',
              field: 'description',
              sort: 'asc'
            },
          ];
          
        return ( 
            <div className="content">
                <Breadcrumb>
                    <BreadcrumbItem><Link to='/'>Home</Link></BreadcrumbItem>
                    {/* <BreadcrumbItem><Link to='/admin/student'>Student</Link></BreadcrumbItem> */}
                    <BreadcrumbItem active>Registration</BreadcrumbItem>
                </Breadcrumb>
                
                <LocalForm id="registrationForm" onSubmit={(values) => this.handleSubmit(values)}>
                <Row>

                    <Col md={12}>
                    <Card>
                        {/* <CardHeader>New Student Registration:</CardHeader>
                        <hr /> */}
                        <CardBody>
                                <h6>Customers' Details:</h6>
                                <hr />
                                <Row className="align-items-center">
                                    <Col md={4}>
                                            <div className="team-player">
                                                <div className="flip-box-front mt-2">
                                                    <img
                                                        alt=""
                                                        className="rounded-circle img-fluid img-raised mx-auto d-block"
                                                        src={this.state.src}
                                                        style={{width:"120px", height:"120px", overflow:"hidden",maxWidth:"100%",borderRadius:"100%", maxHeight:"100%"}}
                                                    ></img>
                                                </div>
                                            </div>
                                            <Row className="form-group mt-5">
                                                <Col>
                                                    <Control.file model=".picture" id="picture" name="picture" id="picture"
                                                        placeholder="Choose file"   
                                                        className="form-control"
                                                        accept=".png, .jpg, .jpeg"
                                                        onChange={this.handleImageUpload}
                                                    />
                                                </Col>
                                            </Row>
                                    </Col>
                                    <Col md={8}>
                                        <Row className="form-group py-2">
                                                                                
                                            <Col md={4}>
                                                <Label style={{fontSize:"1.23em"}}>Customer Name:</Label>
                                                <Control.text model=".customerName" id="customerName" name="customerName"
                                                    placeholder="Customer Name"   
                                                    className="form-control"
                                                    validators={{
                                                        required
                                                    }}
                                                />
                                                <Errors 
                                                    className="text-danger"
                                                    model=".customerName"
                                                    show="touched"
                                                    messages={{
                                                        required: 'Required!'
                                                    }}

                                                />
                                            </Col>

                                            
                                            <Col md={4}>
                                                <Label style={{fontSize:"1.23em"}}>Mobile:</Label>
                                                <Control.text type="number" model=".mobile" id="mobile" name="mobile"
                                                    placeholder="Contact"
                                                    className="form-control"
                                                    validators={{
                                                        isMobileNumber
                                                    }}
                                                />
                                                <Errors 
                                                    className="text-danger"
                                                    model=".mobile"
                                                    id="mobileError"
                                                    show="touched"
                                                    messages={{
                                                        isMobileNumber: 'Invalid Number, must be 10 digits',
                                                    }}

                                                />
                                            </Col>
                                            
                                            <Col md={4}>
                                                <Label style={{fontSize:"1.2em"}}>Gender:</Label>
                                                <Control.select model=".gender" id="gender" name="gender"
                                                    defaultValue="Male"
                                                    className="form-control"
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </Control.select>
                                            </Col>
                                        </Row>
                                        <Row className="form-group">
                                            
                                            <Col md={4}>
                                                <Label style={{fontSize:"1.2em"}}>DOB:</Label>
                                                <Control.text type="date" model=".dob" id="dob" name="dob"
                                                    className="form-control"
                                                    validators={{
                                                        required,  maxLength: maxLength(15)
                                                    }}
                                                />
                                                <Errors 
                                                    className="text-danger"
                                                    model=".dob"
                                                    show="touched"
                                                    messages={{
                                                        required: 'Required!',
                                                        maxLength: 'Must be 15 characters or less...'
                                                    }}

                                                />
                                            </Col>
                                            
                                            <Col md={8}>
                                                <Label style={{fontSize:"1.2em"}}>Email:</Label>
                                                <Control.text model=".email" id="email" name="email"
                                                    placeholder="Email"   
                                                    className="form-control"
                                                />
                                            </Col>
                                        
                                        </Row>
                                        
                                        <Row className="form-group">
                                            

                                            <Col>
                                                <Control.text model=".address" id="address" name="address"
                                                    placeholder="Residential Address"
                                                    className="form-control"
                                                    // rows={3}
                                                    validators={{
                                                        required
                                                    }}
                                                />
                                                <Errors 
                                                    className="text-danger"
                                                    model=".address"
                                                    show="touched"
                                                    messages={{
                                                        required: 'Required!'
                                                    }}

                                                />
                                            </Col>
                                        </Row>
                                        
                                    </Col>

                                </Row>
                                <hr />
                                

                                <h6>Packages: <Button outline color="primary" className="btn btn-sm" onClick={this.toggleModal}>View Details</Button></h6>
                                <hr />
                                {JSON.stringify(this.state.selectedPackage) !== '{}' && this.state.packageForm ? 
                                <div>
                                <Row className="form-group py-2">

                                    
                                    <Col md={3}>
                                        <Label style={{fontSize:"1.2em"}}>Package Name:</Label>
                                        <Control.text model=".packageName" id="packageName" name="packageName"
                                            placeholder="Package Name"   
                                            className="form-control"
                                            value={this.state.selectedPackage.packageName}
                                            disabled
                                        />
                                        
                                    </Col>

                                    
                                    
                                    <Col md={5}>
                                        <Label style={{fontSize:"1.2em"}}>Description:</Label>
                                        <Control.text model=".description" id="description" name="description"
                                            placeholder="Package Description" 
                                            value={this.state.selectedPackage.description}  
                                            className="form-control"
                                            disabled
                                        />
                                    </Col>

                                    <Col md={2}>
                                        <Label style={{fontSize:"1.2em"}}>Type:</Label>
                                        <Control.text model=".type" id="type" name="type"
                                            placeholder="Type" 
                                            value={this.state.selectedPackage.type}  
                                            className="form-control"
                                            disabled
                                        />
                                    </Col>

                                    <Col md={2}>
                                        <Label style={{fontSize:"1.2em"}}>Months:</Label>
                                        <Control.text type="number" model=".months" id="months" name="months"
                                            placeholder="Months" 
                                            value={this.state.selectedPackage.months}
                                            className="form-control"
                                            disabled
                                           
                                        />
                                    </Col>
                                    
                                </Row>
                            

                                <Row className="form-group py-2">
                                    
                                    <Col md={3}>
                                        <Label style={{fontSize:"1.2em"}}>Start Date:</Label>
                                        <Control.text type="date" model=".startDate" id="startDate" name="startDate"
                                            className="form-control"
                                            value={this.state.startDate}
                                            onChange={this.dateChange}
                                            validators={{
                                                required
                                            }}
                                        />
                                        <Errors 
                                            className="text-danger"
                                            model=".startDate"
                                            show="touched"
                                            messages={{
                                                required: 'Required!',
                                            }}

                                        />
                                    </Col>

                                    
                                    <Col md={3}>
                                        <Label style={{fontSize:"1.2em"}}>End Date:</Label>
                                        <Control.text type="date" model=".endDate" id="endDate" name="endDate"
                                            className="form-control"
                                            value={this.state.endDate}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <Label style={{fontSize:"1.2em"}}>Sessions:</Label>
                                        <Control.text model=".totalDays" id="totalDays" name="totalDays"
                                            placeholder="Days"
                                            className="form-control"
                                            value={this.state.totalDays}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <Label style={{fontSize:"1.2em"}}>Instructor:</Label>
                                        <Control.text model=".trainer" id="trainer" name="trainer"
                                            placeholder="Trainer Name"
                                            className="form-control"
                                        />
                                            
                                    </Col>
                                </Row>

                                <hr />
                                <h6 className="pt-3">Payment Details: </h6>
                                <hr />
                                <Row className="form-group py-2">
                                    
                                    <Col md={3}>
                                        <Label style={{fontSize:"1.2em"}}>Package Amount:</Label>
                                        <Control.text type="number" model=".packageAmount" id="packageAmount" name="packageAmount"
                                                placeholder="Package Amount"   
                                                value={this.state.selectedPackage.fees}
                                                className="form-control"
                                                disabled
                                                
                                            />
                                            
                                        </Col>

                                        
                                        <Col md={3}>
                                            <Label style={{fontSize:"1.2em"}}>Total Amount:</Label>
                                            <Control.text type="number" model=".totalAmount" id="totalAmount" name="totalAmount"
                                                    placeholder="Total Amount"   
                                                    value={this.state.totalAmount}
                                                    defaultValue={this.state.totalAmount}
                                                    onChange = {this.onChange}
                                                    className="form-control"
                                                    validators = {{
                                                        isNumber
                                                    }}
                                                />
                                                <Errors 
                                                    className="text-danger"
                                                    model=".totalAmount"
                                                    show="touched"
                                                    messages={{
                                                        isNumber: 'Invalid Input!',
                                                    }}

                                                />
                                        </Col>  
                                        
                                        <Col md={2}>
                                            <Label style={{fontSize:"1.2em"}}>Given:</Label>
                                            <Control.text type="number" model=".givenAmount" id="givenAmount" name="givenAmount"
                                                    placeholder="Given Amount"   
                                                    value={this.state.givenAmount}
                                                    defaultValue={this.state.givenAmount}
                                                    onChange = {this.onChange}
                                                    className="form-control"
                                                    validators = {{
                                                        isNumber
                                                    }}
                                                />
                                                <Errors 
                                                    className="text-danger"
                                                    model=".givenAmount"
                                                    show="touched"
                                                    messages={{
                                                        isNumber: 'Invalid Input!'
                                                    }}

                                                />
                                            </Col>  
                                            
                                            <Col md={4}>
                                                <Label style={{fontSize:"1.2em"}}>Pending Amount:</Label>
                                                <Control.text type="number" model=".pendingAmount" id="pendingAmount" name="pendingAmount"
                                                    placeholder="Pending Amount"   
                                                    value={this.state.pendingAmount = this.state.totalAmount - this.state.givenAmount }
                                                    
                                                    className="form-control"
                                                    disabled
                                                
                                                />
                                            </Col>                                    
                                    
                                </Row>

                                <Row className="form-group py-2">
                                    {/* <Label md={2} style={{fontSize:"1.2em"}}>Given Amt:</Label>
                                    <Col md={3}>
                                        <Control.text type="number" model=".givenAmount" id="givenAmount" name="givenAmount"
                                                placeholder="Given Amount"   
                                                value={this.state.givenAmount}
                                                defaultValue={this.state.givenAmount}
                                                onChange = {this.onChange}
                                                className="form-control"
                                                validators = {{
                                                    isNumber
                                                }}
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".givenAmount"
                                                show="touched"
                                                messages={{
                                                    isNumber: 'Invalid Input!'
                                                }}

                                            />
                                        </Col>

                                        <Label md={2} style={{fontSize:"1.2em"}}>Pending Amt:</Label>
                                        <Col md={3}>
                                        <Control.text type="number" model=".pendingAmount" id="pendingAmount" name="pendingAmount"
                                                placeholder="Pending Amount"   
                                                value={this.state.pendingAmount = this.state.totalAmount - this.state.givenAmount }
                                                className="form-control"
                                                disabled
                                            
                                            />
                                    </Col> */}

                                        {/* <Label md={2} style={{fontSize:"1.2em"}}>Pending:</Label> */}

                                        <Col md={8}>
                                            <Label style={{fontSize:"1.2em"}}>Comments:</Label>
                                            <Control.text model=".paymentComment" id="paymentComment" name="paymentComment"
                                                placeholder="Comments"   
                                                className="form-control"
                                            />
                                        </Col>
                                        
                                        <Col md={4}>
                                            <Label style={{fontSize:"1.2em"}}>Payment Type:</Label>
                                            <Control.select model=".paymentType" id="paymentType" name="paymentType"
                                                    // placeholder="Unique Reg. No."
                                                    defaultValue="Cash"
                                                    className="form-control"
                                                    
                                                >
                                                    <option value="Cash">Cash</option>
                                                    <option value="UPI">UPI</option>
                                                    <option value="Other">Other</option>
                                                </Control.select>
                                        </Col>
                                    
                                </Row>

                                
                                <hr />
                                </div>
                                 : <></>}
                                
                                <Row className="form-group">
                                    <Col md={6}>
                                        <Button color="danger" id="resetBtn" block type="reset" onClick={this.resetPackageForm}>Reset</Button>
                                    </Col>
                                    <Col md={6}>
                                        <Button type="submit" outline block color="success" disabled={this.state.submitDisabled}>
                                            Submit
                                        </Button>
                                    </Col>
                                </Row>
                           
                        </CardBody>
                    </Card>
                    </Col>
                    </Row>
                
                </LocalForm>
                
                <Modal isOpen={this.state.isModalOpen} size="lg" toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>Packages</ModalHeader>
                        <ModalBody>
                            {/* <h4>Nawab The Fitness Empire</h4> */}
                            {/* <hr /> */}

                            {/* handleSelect={this.props.handleSelect} */}
                            {this.state.isDataReturned ? <WithCheckBoxesEnd handleSelect={this.handleSelect}  columns={columns} rows={this.state.packageData} /> : 
                                <>
                                    <div className="sweet-loading text-center">
                                        <ClipLoader 
                                            size={35}
                                            color={"#009dff"}
                                            loading={true}
                                        />
                                    </div>
                                </>
                            }

                        </ModalBody>
                        <ModalFooter>
                            {/* <Button color="primary" onClick={this.toggleModal}>Do Something</Button>{' '}
                            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button> */}
                        </ModalFooter>
                    </Modal>
                

            </div>
         );
    }
}
 
export default Registration;
