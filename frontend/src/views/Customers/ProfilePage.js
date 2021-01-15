import React, { Component } from 'react';
import { Card,CardHeader,CardBody,Alert,CardTitle,Row,Col,Button, Badge, Breadcrumb, BreadcrumbItem, Label,Modal,ModalHeader, ModalBody,ModalFooter, Table} from "reactstrap";
import { Link } from "react-router-dom";
import axios from 'axios'
import { Control, LocalForm, Errors } from 'react-redux-form';
import $ from 'jquery'
import BarChart from 'react-bar-chart';
import { MDBDataTableV5 } from 'mdbreact';

import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'
import { appendText } from 'gulp-append-prepend';
import Swal from 'sweetalert2'
// const override = css`
//   filter: blur(-3px);
  
// `;

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len)
const isMobileEmpty = (len) => (val) => !(val) || (val.length <= 10)
const minLength = (len) => (val) => (val) && (val.length >= len)
const isSelectedNumber = (val) => isNaN(Number(val));
const isZero = (val) => !(val == 0);
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

class FeePaymentComponent extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            customerId: this.props.customerId,
            currentFeeHistory: this.props.currentFeeHistory,
            currentPackage: this.props.currentPackage,
            currentPayment: this.props.currentPayment,
            isPackageModalOpen: false,
            packageData: [],
            isPackageDataReturned: false,
            selectedPackage: {},
            deletePackageDisabled: false,
            feePaymentDisabled: false,
        }
    }

    handleSelect = (obj) => {
        this.setState({
            selectedPackage: obj,
            startDate: '',
            endDate: '',
            totalDays: '',
            totalAmount: '',
            givenAmount: '',
            pendingAmount: '',
        })
    }

    togglePackageModal = () =>{
        if(this.state.currentFeeHistory !==0 && this.state.currentPackage !==0 && this.state.currentFeeHistory.pendingAmount !==0){
            Swal.fire("Please Pay The Pending Amount First!")
            
        }else{
            this.setState({isPackageModalOpen: !this.state.isPackageModalOpen})
        }
        
    }

    getPackageData = async() => {
        const dataReceived = await axios.get(`https://fittzee-backend.herokuapp.com/package`)

        console.log(dataReceived)

        this.setState({
            packageData: dataReceived.data,
            isPackageDataReturned: true
        })
    }

    async componentDidMount(){
        await this.getPackageData();
    }

    feeSubmit = (values) => {

        console.log(values)

        const body = {
            totalAmount: this.state.currentFeeHistory.totalAmount,
            givenAmount: parseInt(values.feePayment),
            pendingAmount: this.state.currentFeeHistory.pendingAmount - values.feePayment,
            paymentComment: values.paymentComment,
            paymentType: values.paymentType,
            pending: this.state.currentFeeHistory.pendingAmount - values.feePayment === 0 ? false : true,
        }

        console.log(body)

        Swal.fire({
            title: 'Make Payment?',
            // text: 'Make Payment!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
          }).then((result) => {
            if (result.value) {

                this.setState({
                    feePaymentDisabled: true
                })

                axios.put(`https://fittzee-backend.herokuapp.com/customer/feepayment/${this.state.customerId}/package/${this.state.currentPackage._id}/`, body, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('tokn')}` 
                    } 
                })  
                .then((response) => {
                    this.setState({
                        feePaymentDisabled: false
                    })
                    // setResponse(response.data);
                    console.log("Response");
                    console.log(response)
                    if (response.status === 200) {
                        console.log("Created");
                        store.addNotification({
                            title: "Fee!",
                            message: "Fee Payment Successfully!",
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
                        

                        this.props.handleProfileUpdate();
                        
                    }
                }).catch((error) => {
                    this.setState({
                        feePaymentDisabled: false
                    })
                    console.log("error");
                    console.log(error)
                    store.addNotification({
                        title: "Fee Error!",
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


    DeleteCurrentPackage = () => {


        Swal.fire({
            title: 'Delete Current Package?',
            text: 'You will not be able to recover this data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel, keep it'
          }).then((result) => {
            if (result.value) {

                this.setState({
                    deletePackageDisabled: true
                })

                axios.delete(`https://fittzee-backend.herokuapp.com/customer/profile/${this.state.customerId}/package/delete/${this.state.currentPackage._id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('tokn')}` 
                    } 
                })  
                .then((response) => {
                    this.setState({
                        deletePackageDisabled: false
                    })
                    // setResponse(response.data);
                    console.log("Response");
                    console.log(response)
                    if (response.status === 200) {
                        console.log("deleted");
                        store.addNotification({
                            title: "Deleted!",
                            message: "Package Deleted Successfully!",
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
                        
                        this.props.handleProfileUpdate();
                        
                    }
                }).catch((error) => {
                    this.setState({
                        deletePackageDisabled: false
                    })
                    console.log("error");
                    console.log(error)
                    store.addNotification({
                        title: "Error!",
                        message: "Error While Updating!",
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

    render(){
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
        return(
            <div>
            <Card>

            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                <Row>

                    <Col>
                        <CardBody>                               
                                
                                {this.state.currentPackage !== 0 && this.state.currentFeeHistory !== 0 && this.state.currentPackage._id === this.state.currentPayment.packageId? 
                                <>
                                    {new Date().getTime() > Date.parse(this.state.currentPackage.endDate)? 
                                        <div className="d-flex justify-content-between align-items-baseline">
                                            <h6>Current Package : <span className="text-danger font-weight-bold">Expired</span></h6>
                                            <Button outline color="primary" className="btn btn-sm" onClick={this.togglePackageModal}>Buy New Package</Button>       
                                        </div>
                                    :
                                        <div className="d-flex justify-content-between align-items-baseline">
                                            <h6>Current Package : <span className="text-success font-weight-bold"> Active</span></h6>
                                            <Button outline color="danger" className="btn btn-sm" onClick={this.DeleteCurrentPackage} disabled={this.state.deletePackageDisabled}>Delete Package</Button>       
                                        </div>                                
                                    }
                                </>

                                :

                                    <div className="d-flex justify-content-between align-items-baseline">
                                        <h6>No Active Package :</h6>
                                        <Button outline color="primary" className="btn btn-sm" onClick={this.togglePackageModal}>Buy New Package</Button>       
                                    </div>
                                
                                }


                                {this.state.currentPackage !== 0 && this.state.currentFeeHistory !== 0 && this.state.currentPackage._id === this.state.currentPayment.packageId ? 
                                <>
                                <hr />
                                {new Date().getTime() > Date.parse(this.state.currentPackage.endDate) ? <></>:
                                <div>
                                    <Row className="form-group py-2">

                                        
                                        <Col md={3}>
                                            <Label style={{fontSize:"1.2em"}}>Package Name:</Label>
                                            <Control.text model=".packageName" id="packageName" name="packageName"
                                                placeholder="Package Name"   
                                                className="form-control"
                                                value={this.state.currentPackage.packageName}
                                                disabled
                                            />                                        
                                        </Col>

                                        <Col md={5}>
                                            <Label style={{fontSize:"1.2em"}}>Description:</Label>
                                            <Control.text model=".description" id="description" name="description"
                                                placeholder="Package Description" 
                                                value={this.state.currentPackage.description}  
                                                className="form-control"
                                                disabled
                                            />                                        
                                        </Col>

                                        <Col md={2}>
                                            <Label style={{fontSize:"1.2em"}}>Type:</Label>
                                            <Control.text model=".type" id="type" name="type"
                                                placeholder="Type" 
                                                value={this.state.currentPackage.type}  
                                                className="form-control"
                                                disabled
                                            />                                        
                                        </Col>

                                        <Col md={2}>
                                            <Label style={{fontSize:"1.2em"}}>Months:</Label>
                                            <Control.text type="number" model=".months" id="months" name="months"
                                                placeholder="Months" 
                                                value={this.state.currentPackage.months}  
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
                                                value={this.state.currentPackage.startDate}
                                                // validators={{
                                                //     required
                                                // }}
                                                disabled
                                            />
                                            {/* <Errors 
                                                className="text-danger"
                                                model=".startDate"
                                                show="touched"
                                                messages={{
                                                    required: 'Required!',
                                                }}

                                            /> */}
                                        </Col>

                                        <Col md={3}>
                                            <Label style={{fontSize:"1.2em"}}>End Date:</Label>
                                            <Control.text type="date" model=".endDate" id="endDate" name="endDate"
                                                className="form-control"
                                                value={this.state.currentPackage.endDate}
                                                disabled
                                            />
                                        </Col>

                                        <Col md={2}>
                                            <Label style={{fontSize:"1.2em"}}>Sessions:</Label>
                                            <Control.text model=".totalDays" id="totalDays" name="totalDays"
                                                placeholder="Days"
                                                className="form-control"
                                                value={this.state.currentPackage.totalDays}
                                                disabled
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <Label style={{fontSize:"1.2em"}}>Instructor:</Label>
                                            <Control.text model=".trainer" id="trainer" name="trainer"
                                                placeholder="Trainer"
                                                value={this.state.currentPackage.trainer}
                                                className="form-control"
                                                disabled
                                            />
                                                
                                        </Col>
                                    </Row>

                                    <Row className="form-group pb-2">
                                        
                                        <Col md={3}>
                                            <Label style={{fontSize:"1.2em"}}>Package Amount:</Label>
                                            <Control.text type="number" model=".packageAmount" id="packageAmount" name="packageAmount"
                                                    placeholder="Package Amount"   
                                                    value={this.state.currentPackage.packageAmount}
                                                    className="form-control"
                                                    disabled
                                                    
                                                />
                                            </Col>

                                            
                                            <Col md={3}>
                                                <Label style={{fontSize:"1.2em"}}>Total Amount:</Label>
                                                <Control.text type="number" model=".totalAmount" id="totalAmount" name="totalAmount"
                                                        placeholder="Total Amount"   
                                                        value={this.state.currentPackage.totalAmount}
                                                        className="form-control"
                                                        // validators = {{
                                                        //     required
                                                        // }}
                                                        disabled
                                                    />
                                                    {/* <Errors 
                                                        className="text-danger"
                                                        model=".totalAmount"
                                                        show="touched"
                                                        messages={{
                                                            required: 'Required!',
                                                            maxLength: 'Requ'
                                                        }}
                                                    /> */}
                                            </Col>

                                            <Col md={2}>
                                                <Label style={{fontSize:"1.2em"}}>Given:</Label>
                                                <Control.text type="number" model=".givenAmount" id="givenAmount" name="givenAmount"
                                                        placeholder="Given Amount"   
                                                        value={this.state.currentFeeHistory.totalAmount - this.state.currentFeeHistory.pendingAmount}
                                                        onChange = {this.onChange}
                                                        className="form-control"
                                                        // validators = {{
                                                        //     required
                                                        // }}
                                                        disabled
                                                    />
                                                    {/* <Errors 
                                                        className="text-danger"
                                                        model=".givenAmount"
                                                        show="touched"
                                                        messages={{
                                                            required: 'Required!'
                                                        }}

                                                    /> */}
                                                </Col>
                                        

                                            <Col md={4}>
                                                <Label style={{fontSize:"1.2em"}}>Pending Amount:</Label>
                                                <Control.text type="number" model=".pendingAmount" id="pendingAmount" name="pendingAmount"
                                                        placeholder="Pending Amount"   
                                                        value={this.state.currentFeeHistory.pendingAmount}
                                                        className="form-control"
                                                        disabled
                                                    />
                                            </Col>
                                        
                                    </Row>

                                    
                                <hr />

                                </div>
                                }
                                </>
                                :<></>}




                                {JSON.stringify(this.state.selectedPackage) !== '{}'?
                                    <BuyNewPackage handleProfileUpdate={this.props.handleProfileUpdate} customerId={this.state.customerId} selectedPackage={this.state.selectedPackage}/>
                                :<></>}
                                
                                
                                
                        
                        </CardBody>
                    
                    </Col>
                    </Row>

                </LocalForm>

                {/* ============================================================================================================ */}

                {this.state.currentPackage !== 0 && this.state.currentFeeHistory !== 0 && this.state.currentPackage._id === this.state.currentPayment.packageId ? 

                <>

                <CardHeader>
                    <h6>Fee Payment History {new Date().getTime() > Date.parse(this.state.currentPackage.endDate)? <span className="font-weight-bold text-danger"> - Package Expired</span> :<></>}
                    </h6>
                    <hr />
                </CardHeader>
                
                <CardHeader className="font-weight-bold">
                    {this.state.currentPackage.packageName} of {this.state.currentPackage.months} Months - from {this.state.currentPackage.startDate} to {this.state.currentPackage.endDate} ({this.state.currentPackage.description})
                    {this.state.currentPackage.extended? <span className="text-danger pl-2">- Extended ( {this.state.currentPackage.extendDays} days )</span>:""}
                </CardHeader>
                <CardBody>
                    <table className="table table-bordered table-sm">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Sr no.</th>
                                <th scope="col">Total Fee</th>
                                <th scope="col">Given Fee</th>
                                <th scope="col">Comment</th>
                                <th scope="col">Date</th>
                                <th scope="col">Pending Fee</th>
                                <th scope="col">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.currentPayment.feesHistory.map((feeHist, idx)=>{
                                return(
                                    <tr>
                                        <th scope="row">{idx+1}</th>
                                        <td>{feeHist.totalAmount} rs.</td>
                                        <td>{feeHist.givenAmount} rs.</td>
                                        <td>{feeHist.paymentComment}</td>
                                        <td>{feeHist.paymentDate.substring(0,15)}</td>
                                        <td className="text-danger">{feeHist.pendingAmount} rs.</td>
                                        <td>{feeHist.paymentType}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    
                    {this.state.currentFeeHistory.pendingAmount !== 0? 
                    <LocalForm onSubmit={(values) => this.feeSubmit(values)}>
                        <Row className="form-group">
                            <Label md={1} style={{fontSize: "1.3em"}}>Fee:</Label>
                            <Col md={2}>
                                <Control.text model=".feePayment" className="feePayment" id="feePayment"
                                    type="number"
                                    className="form-control"
                                    placeholder="Fee Payment"
                                    max={this.state.currentFeeHistory.pendingAmount}
                                    validators = {{
                                        isNumber
                                    }}
                                />
                                <Errors
                                    className="text-danger"
                                    model=".feePayment"
                                    show="touched"
                                    messages={{
                                        isNumber: "Invalid Input"
                                    }}
                                />
                            </Col>
                            <Col md={4}>
                                <Control.text model=".paymentComment" className="paymentComment" id="paymentComment"
                                    className="form-control"
                                    placeholder="Comment"
                                    // validators = {{
                                    //     isNumber
                                    // }}
                                />
                                {/* <Errors
                                    className="text-danger"
                                    model=".paymentComment"
                                    show="touched"
                                    messages={{
                                        isNumber: "Invalid Input"
                                    }}
                                /> */}
                            </Col>
                            <Col md={2}>
                                <Control.select model=".paymentType" id="paymentType" name="paymentType"
                                    defaultValue="Cash"
                                    className="form-control"
                                    validators={{
                                        required
                                    }}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Other">Other</option>
                                </Control.select>
                            </Col>
                            <Col md={3}>
                                <Button type="reset" className="mt-0 d-none" outline block color="success">
                                    reset
                                </Button>
                                <Button type="submit" className="mt-0" outline block color="success" disabled={this.state.feePaymentDisabled}>
                                    Pay
                                </Button>
                            </Col>
                        </Row>
                    </LocalForm>
                    :<></>}
                </CardBody>
                </>
                :<></>}
            </Card>

            <Modal isOpen={this.state.isPackageModalOpen} size="lg" toggle={this.togglePackageModal}>
                    <ModalHeader toggle={this.togglePackageModal}>Packages</ModalHeader>
                    <ModalBody>
                        {/* <h4>Nawab The Fitness Empire</h4> */}
                        {/* <hr /> */}

                        {/* handleSelect={this.props.handleSelect} */}
                        {this.state.isPackageDataReturned ? <WithCheckBoxesEnd handleSelect={this.handleSelect}  columns={columns} rows={this.state.packageData} /> : 
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
        )
    }
}


class BuyNewPackage extends Component {
    constructor(props){
        super(props);
        this.state = {
            customerId: this.props.customerId,
            selectedPackage: this.props.selectedPackage,
            startDate: '',
            endDate: '',
            totalDays: '',
            totalAmount: '',
            givenAmount: '',
            pendingAmount: '',
            buyNewPackageDisabled: false
        }
    }

    resetBuyNewPackageForm = (e) => {
        e.preventDefault()
        document.getElementById("buynewpackage-form").reset();
        this.setState({
            startDate: '',
            endDate: '',
            totalDays: '',
            totalAmount: '',
            givenAmount: '',
            pendingAmount: '',
        })
    }

    componentDidMount(){
        console.log("Buy new package mounted")
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        console.log("Buy new package updated")
        if (this.props !== prevProps) {
            console.log("this.props !== prevProps")
            this.setState({
                selectedPackage: this.props.selectedPackage,
            })
        }
      }


    handlePackageUpdate = (values) => {

        console.log(values)

        const body = {
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
            paymentComment: values.paymentComment,
            trainer: values.trainer,
            pending: this.state.givenAmount === this.state.totalAmount ? false : true,
            user: localStorage.getItem('usr'),
        }

        console.log(body)

        Swal.fire({
            title: 'Confirm Package?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
          }).then((result) => {
              
            if (result.value) {

                this.setState({
                    buyNewPackageDisabled: true
                })

                axios.put(`https://fittzee-backend.herokuapp.com/customer/buynewpackage/${this.state.customerId}`, body, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('tokn')}` 
                    } 
                })  
                .then((response) => {
                    this.setState({
                        buyNewPackageDisabled: false
                    })
                    // setResponse(response.data);
                    console.log("Response");
                    console.log(response)
                    if (response.data.statusCode === 200) {
                        console.log("Created");
                        store.addNotification({
                            title: "New Package!",
                            message: "Package Buyed Successfully!",
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
                        document.getElementById("buynewpackage-form").reset();
                        this.props.handleProfileUpdate();
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
                        buyNewPackageDisabled: false
                    })
                    console.log("error");
                    console.log(error)
                    store.addNotification({
                        title: "Error!",
                        message: "Error While Buying Package!",
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
                })
                
            }else if (result.dismiss === Swal.DismissReason.cancel) {
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
          
        return ( 
            <div className="content">
                  
                <LocalForm id="buynewpackage-form" onSubmit={(values) => this.handlePackageUpdate(values)}>
                <Row>

                    <Col>
                    
                                {JSON.stringify(this.state.selectedPackage) !== '{}'? 
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
                                            defaultValue={this.state.startDate}
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
                                            // defaultValue={this.state.endDate}
                                            value={this.state.endDate}
                                            // validators={{
                                            //     required
                                            // }}
                                            disabled
                                        />
                                        {/* <Errors 
                                            className="text-danger"
                                            model=".endDate"
                                            show="touched"
                                            messages={{
                                                required: 'Required!',
                                                maxLength: 'Must be 15 characters or less...'
                                            }}

                                        /> */}
                                    </Col>
                                    <Col md={2}>
                                        <Label style={{fontSize:"1.2em"}}>Sessions:</Label>
                                        <Control.text model=".totalDays" id="totalDays" name="totalDays"
                                            placeholder="Days"
                                            className="form-control"
                                            // defaultValue={this.state.totalDays}
                                            value={this.state.totalDays}
                                            // validators={{
                                            //     required
                                            // }}
                                            disabled
                                        />
                                        {/* <Errors 
                                            className="text-danger"
                                            model=".totalDays"
                                            show="touched"
                                            messages={{
                                                required: 'Required!'
                                            }}

                                        /> */}
                                    </Col>

                                    <Col md={4}>
                                        <Label style={{fontSize:"1.2em"}}>Instructor:</Label>
                                        <Control.text model=".trainer" id="trainer" name="trainer"
                                            placeholder="Trainer"
                                            className="form-control"
                                        />
                                    </Col>
                                    
                                </Row>

                                <Row className="form-group py-2">
                                    
                                        <Col md={3}>
                                            <Label style={{fontSize:"1.2em"}}>Package Amount:</Label>
                                            <Control.text type="number" model=".packageAmount" id="packageAmount" name="packageAmount"
                                                placeholder="Package Amount"   
                                                value={this.state.selectedPackage.fees}
                                                // defaultValue={this.state.selectedPackage.fees}
                                                className="form-control"
                                                disabled
                                            />
                                            {/* <Errors 
                                                className="text-danger"
                                                model=".packageAmount"
                                                show="touched"
                                                messages={{
                                                    required: 'Required!'
                                                }}

                                            /> */}
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
                                                    isNumber: 'Invalid Input'
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
                                                    isNumber: 'Invalid Input'
                                                }}

                                            />
                                        </Col>

                                        <Col md={4}>
                                            <Label style={{fontSize:"1.2em"}}>Pending Amount:</Label>
                                            <Control.text type="number" model=".pendingAmount" id="pendingAmount" name="pendingAmount"
                                                placeholder="Pending Amount"   
                                                value={this.state.pendingAmount = this.state.totalAmount - this.state.givenAmount }
                                                // value={this.state.pendingAmount}
                                                className="form-control"
                                                disabled
                                            
                                            />
                                        </Col>

                                        {/* <Label md={2} style={{fontSize:"1.2em"}}>Pending:</Label> */}
                                    </Row>

                                <Row className="form-group py-2">

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
                                                onChange={this.onSelectedOption}
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
                                        <Button color="danger" id="reset-buynewpackage-form" block type="reset" onClick={this.resetBuyNewPackageForm}>Reset</Button>
                                    </Col>
                                    <Col md={6}>
                                        <Button type="submit" outline block color="success" disabled={this.state.buyNewPackageDisabled}>
                                            Buy New Package
                                        </Button>
                                    </Col>
                                </Row>
                        
                    </Col>
                    </Row>
                
                </LocalForm>
                
            </div>
         );
    }
}
 

class ProfileComponent extends React.Component{
    constructor(props){
        super(props)
        this.state= {
            data: this.props.data,
            currentPackage: this.props.currentPackage,
            currentFeeHistory: this.props.currentFeeHistory,
            payments: this.props.payments,
            customerName: this.props.data.customerName,
            profilePic: this.props.data.profilePic,
            mobile: this.props.data.mobile,
            email: this.props.data.email,
            gender: this.props.data.gender,
            dob: this.props.data.dob,
            address: this.props.data.address,
            selectedFile: null,
            updateProfileDisabled: false,
            deleteProfileDisabled: false,
        }
    }
    handleImageUpload = (e) => {
        e.preventDefault();
        if(e.target.files.length > 0){
            this.setState({
                selectedFile: e.target.files[0]
            });
            return            
        }else{
            this.setState({
                selectedFile: null
            });
            return 
        }       
        
    }


    handleCustomerProfileUpdate = (values) => {
        
        let body = {
            customerName: values.customerName,
            mobile: values.mobile,
            email: values.email,
            gender: values.gender,
            dob: values.dob,
            address: values.address,
            user: localStorage.getItem('usr')
        }

        console.log(values)

        const formData = new FormData();
        formData.append("values", JSON.stringify(body));
        formData.append("file", this.state.selectedFile);


        Swal.fire({
            title: 'Update Profile?',
            // text: 'You will not be able to recover this data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'Cancel, keep it'
          }).then((result) => {
            if (result.value) {

                this.setState({
                    updateProfileDisabled: true
                })

                axios.put(`https://fittzee-backend.herokuapp.com/customer/profile/update/${this.state.data._id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('tokn')}` 
                } 
                })  
                .then((response) => {

                    this.setState({
                        updateProfileDisabled: false
                    })

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
                        console.log("Updated");
                        store.addNotification({
                            title: "Success!",
                            message: "Profile Updated Successfully!",
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
                        this.props.handleProfileUpdate();

                        
                    }
                }).catch((error) => {

                    this.setState({
                        updateProfileDisabled: false
                    })

                    console.log("error");
                    console.log(error)
                    store.addNotification({
                        title: "Error!",
                        message: "Error While Updation!",
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

    printBill = (e) => {
        this.props.history.push(`/admin/customers/invoice/${this.state.data._id}`)
    }

    onProfileDataChange = (e) =>{
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleProfileDelete = async() => {


        Swal.fire({
            title: 'Delete Profile?',
            text: 'You will not be able to recover this data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel, keep it'
          }).then((result) => {
            if (result.value) {

                this.setState({
                    deleteProfileDisabled: true
                })
                
                axios.delete(`https://fittzee-backend.herokuapp.com/customer/profile/delete/${this.state.data._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('tokn')}`
                    }
                }
            ).then((response) => {

                this.setState({
                    deleteProfileDisabled: false
                })

                console.log("Response");
                console.log(response)
                if (response.data.statusCode === 200) {
                    console.log("Del Success");
                    store.addNotification({
                        title: "Success!",
                        message: "Profile Deleted Successfully!",
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
                    // this.props.handleUpdate();
                    this.props.history.replace("/admin/customers");
                }
            }).catch((e) => {

                this.setState({
                    deleteProfileDisabled: false
                })

                console.log("Error is -")
                console.log(e)
                store.addNotification({
                    title: "Error!",
                    message: "Error While Deleting!",
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
            });


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

   

    render()
    {
        return(
            <div>
                

                <LocalForm onSubmit={(values) => this.handleCustomerProfileUpdate(values)}>
                <Row>

                    <Col>
                    <Card>
                        <CardBody>
                                <div className="d-flex justify-content-between">
                                    <h4 className="mt-2 mb-0">Customers' Details: {this.props.data.freezed? <span className="text-info font-weight-bold">Freezed</span>:""}</h4>
                                    <div className="d-flex">
                                        {/* <Button outline color="success" className="btn-sm" onClick={this.toggleSupplimentModal}>Buy Suppliment</Button> */}
                                        {this.state.currentFeeHistory !==0 ?
                                        <Button outline color="primary" className="btn-sm ml-2" onClick={this.printBill}>Print Bill</Button>
                                        : <Button outline color="primary" className="btn-sm ml-2" disabled>Print Bill</Button> }
                                    </div>                                    
                                </div>
                                <hr />
                                <Row>
                                <Col md={4}>
                                        <div className="team-player">
                                            <div className="flip-box-front mt-2">
                                            <img
                                                alt=""
                                                className="rounded-circle img-fluid img-raised mx-auto d-block"
                                                src = { this.state.profilePic !== null ? `https://fittzee-backend.herokuapp.com/resized/${this.state.profilePic}` : require('./../../assets/img/default-avatar.png')}
                                                style={{width:"120px", height:"120px", overflow:"hidden",maxWidth:"100%",borderRadius:"100%", maxHeight:"100%"}}
                                            ></img>
                                            </div>
                                        </div>
                                        <Row className="form-group mt-5">
                                            <Col>
                                                <Control.file model=".picture" id="picture" name="picture"
                                                    placeholder="First Name"   
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
                                                defaultValue={this.state.customerName} 
                                                // onChange={this.onProfileDataChange}
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
                                                defaultValue={this.state.mobile} 
                                                // value={this.state.mobile} 
                                                // onChange={this.onProfileDataChange}
                                                validators={{
                                                    isMobileNumber
                                                }}
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".mobile"
                                                show="touched"
                                                messages={{
                                                    isMobileNumber: 'Invalid phone number, must be 10 digits!'
                                                }}

                                            />
                                        </Col>

                                        
                                        <Col md={4}>
                                            <Label style={{fontSize:"1.2em"}}>Gender:</Label>
                                            <Control.select model=".gender" id="gender" name="gender"
                                                defaultValue={this.state.gender}
                                                // onChange={this.onProfileDataChange}
                                                className="form-control"
                                                validators={{
                                                    required
                                                }}
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
                                                // placeholder="Unique Reg. No."
                                                className="form-control"
                                                defaultValue={this.state.dob}
                                                onChange={this.onProfileDataChange}
                                                validators={{
                                                    required
                                                }}
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".dob"
                                                show="touched"
                                                messages={{
                                                    required: 'Required!',
                                                }}

                                            />
                                        </Col>

                                        <Col md={8}>
                                            <Label style={{fontSize:"1.2em"}}>Email:</Label>
                                            <Control.text model=".email" id="email" name="email"
                                                placeholder="Email"   
                                                className="form-control"
                                                defaultValue={this.state.email}
                                                // onChange={this.onProfileDataChange}
                                                // validators={{
                                                //     required,validEmail
                                                // }}
                                            />
                                            <Errors 
                                                className="text-danger"
                                                model=".email"
                                                show="touched"
                                                messages={{
                                                    required: 'Required!',
                                                    validEmail:'Invali Email'
                                                }}

                                            />
                                        </Col>

                                    </Row>
                                    
                                    <Row className="form-group">                                     
      
                                        <Col>
                                            <Control.text model=".address" id="address" name="address"
                                                placeholder="Residential Address"
                                                className="form-control"
                                                defaultValue={this.state.address}
                                                // onChange={this.onProfileDataChange}
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
                                <Row className="form-group">
                                    <Col md={6}>
                                        <Button color="danger" block onClick={this.handleProfileDelete} disabled={this.state.deleteProfileDisabled}>Delete</Button>
                                    </Col>
                                    <Col md={6}>
                                        <Button type="" outline block color="success" disabled={this.state.updateProfileDisabled}>
                                            Update
                                        </Button>
                                    </Col>
                                </Row>
                        
                        </CardBody>
                    </Card>
                    </Col>
                    </Row>

                </LocalForm>

                
            </div>
        )
    }
}

class ProfilePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: this.props.match.params.id,
            data: [],
            currentPackage: {},
            currentFeeHistory: {},
            payments: [],
            isDataReturned: false,
            package: 0,
            isModalOpen: false,
            isSupplimentModalOpen: false,
            supplimentData:{},
            isSupplimentDataReturned: false,
            suppliment:"",
            unitPrice:"",
            quantity: 1,
            totalPrice:"",
            refresher: 0,
        }
    }

    


    toggleModal = () =>{
        this.setState({isModalOpen: !this.state.isModalOpen})
    }
    // toggleSupplimentModal = () =>{
    //     this.setState({isSupplimentModalOpen: !this.state.isSupplimentModalOpen})
    // }

    handleSubmit = (values) => {

        console.log(values)

        const formData = new FormData();
        formData.append("values", JSON.stringify(values));
        formData.append("file", this.state.selectedFile);
        formData.append("user", localStorage.getItem('usr'));

        axios.post(`https://fittzee-backend.herokuapp.com/customer/registration`, formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}` 
            } 
        })  
        .then((response) => {
            // setResponse(response.data);
            console.log("Response");
            console.log(response)
            if (response.status === 200) {
                console.log("Created");
                store.addNotification({
                    title: "Success!",
                    message: "Created Successfully!",
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
                document.getElementById("reset").click();
                this.setState({src: require('./../../assets/img/default-avatar.png')});
                document.getElementById('picture').value = '';
            }
        }).catch((error) => {
            console.log("error");
            console.log(error)
        })
    }

    // getSupplimentData = async() => {
    //     const dataReceived = await axios.get(`https://fittzee-backend.herokuapp.com/suppliment/customer`);
        
        
    //     console.log(dataReceived)
        
    //     this.setState({
    //         supplimentData: dataReceived.data,
    //         isSupplimentDataReturned: true
    //     })
    // }

    getData = async() => {
        const dataReceived = await axios.get(`https://fittzee-backend.herokuapp.com/customer/fetch/${this.state.id}`);
        
        
        console.log(dataReceived)

        if(dataReceived.data.length > 0){
        
            this.setState({
                data:dataReceived.data[0],
                package: dataReceived.data[0].packages,
                currentPackage: dataReceived.data[0].packages.length >0 ? dataReceived.data[0].packages[0] : 0,
                payments: dataReceived.data[0].payments,
                currentFeeHistory: dataReceived.data[0].payments.length >0 ? dataReceived.data[0].payments[0].feesHistory[0] : 0,
                isDataReturned:true,

            })
        
        }else{
            this.props.history.replace('/admin/customers')
        }
    }
    async componentDidMount(){
        await this.getData();
        // await this.getSupplimentData();
    }

    handleProfileUpdate = () => {
        this.setState({
            isDataReturned: false,
            refresher: this.state.refresher+1
        })
        this.getData();
    }


    handleSupplimentSubmit = (values) => {
        
        let body = {
            productName: this.state.suppliment,
            category: "suppliment",
            quantity: this.state.quantity,
            unitPrice: this.state.unitPrice,
            totalPrice: this.state.totalPrice,
            customer: JSON.stringify({_id: this.state.id, customerName: this.state.data.customerName, contact: this.state.data.contact}),
            paymentType: values.paymentType,
            user: localStorage.getItem('usr')
        }

        console.log(body)
        
        axios.post(`https://fittzee-backend.herokuapp.com/suppliment/buy`, body, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}` 
            } 
        })  
        .then((response) => {
            // setResponse(response.data);
            console.log("Response");
            console.log(response)
            if (response.status === 200 || response.status===304) {
                console.log("Created");
                store.addNotification({
                    title: "Suppliment!",
                    message: "Suppliment Buyed Successfully!",
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

                this.toggleSupplimentModal()
                
                this.setState({
                    suppliment:"",
                    unitPrice:"",
                    quantity: 1,
                    totalPrice:"",
                })

                
            }
        }).catch((error) => {
            console.log("error");
            console.log(error)
        })
    }

    handleUpdate = (values) => {
        console.log(values)

        var picture = (values.picture!==undefined);
        
        console.log(picture)

        if(picture){
            console.log(values)
            console.log("checksd")

            const formData = new FormData();
            formData.append("values", JSON.stringify(values));
            
            formData.append("amount", this.state.package_amount);
            formData.append("otp", this.state.otp);
            formData.append("file", this.state.selectedFile);
            formData.append("user", localStorage.getItem('usr'));

            axios.post(`https://fittzee-backend.herokuapp.com/customer/update/picture/${this.state.id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('tokn')}` 
                } 
            })  
            .then((response) => {
                // setResponse(response.data);
                console.log("Response");
                console.log(response)
                if (response.status === 200) {
                    console.log("Created");
                    store.addNotification({
                        title: "Success!",
                        message: "Profile Updated Successfully!",
                        type: "default",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                        duration: 2000,
                        onScreen: true
                        }
                    });
                    document.getElementById('picture').value = '';
                }
            }).catch((error) => {
                console.log("error");
                console.log(error)
            })
        }else{
            axios.post(`https://fittzee-backend.herokuapp.com/customer/update/${this.state.id}`,  
            {
                values:JSON.stringify(values),
                amount: this.state.package_amount,
                otp: this.state.otp
            },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('tokn')}`
                    }
                }
            ).then((response) => {
                console.log("Response");
                console.log(response)
                if (response.status === 200 || response.status===304) {
                    console.log("Update Success");
                    store.addNotification({
                        title: "Success!",
                        message: "Profile Updated Successfully!",
                        type: "default",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                        duration: 2000,
                        onScreen: true
                        }
                    });
                    // this.props.handleUpdate();
                }
            }).catch((e) => {
                console.log("Error is -")
                console.log(e)
                store.addNotification({
                    title: "Error!",
                    message: "Error While Updation!",
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
            });
        }

        
    }

    handleDelete = async() => {
        var result = window.confirm("Are you sure to delete selected user?"); 
        if (result === true) { 
            
            axios.delete(`https://fittzee-backend.herokuapp.com/customer/delete/${this.state.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('tokn')}`
                    }
                }
            ).then((response) => {
                console.log("Response");
                console.log(response)
                if (response.status === 200 || response.status===304) {
                    console.log("Del Success");
                    store.addNotification({
                        title: "Success!",
                        message: "Profile Deleted Successfully!",
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
                    // window.location.reload();
                    // this.props.handleUpdate();
                    window.location.href="/admin/customers";
                }
            }).catch((e) => {
                console.log("Error is -")
                console.log(e)
                store.addNotification({
                    title: "Error!",
                    message: "Error While Deletion!",
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
            });
           
        } else { 
            store.addNotification({
                title: "Cancelled!",
                message: "Cancelled Successfully!",
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
    }

    // onSelectedOption =(e)=>{
    //     this.setState({
    //         package_amount: parseInt($(e.target.options[e.target.selectedIndex]).attr("data-amount")),
    //         otp: $(e.target.options[e.target.selectedIndex]).attr("data-otp")
    //     })
    // }

    // onSupplimentChange = (e) =>{
    //     this.setState({
    //         [e.target.name] : e.target.value
    //     })
    // }
    // onSupplimentSelectedOption =(e)=>{
    //     this.setState({
    //         suppliment: e.target.value,
    //         unitPrice: parseInt($(e.target.options[e.target.selectedIndex]).attr("data-amount")),
    //     })
    // }

    handleBarClick = (element, id) => { 
        console.log(`The bin ${element.text} with id ${id} was clicked`);
    }

    render() { 

        return ( 
            <div className="content">
                <Breadcrumb>
                    <BreadcrumbItem><Link to='/'>Home</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to='/admin/customers'>Customer</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Profile</BreadcrumbItem>
                </Breadcrumb>
                
                {this.state.isDataReturned? 
                    <ProfileComponent handleProfileUpdate={this.handleProfileUpdate} history={this.props.history} data={this.state.data} currentPackage={this.state.currentPackage} currentFeeHistory={this.state.currentFeeHistory}/>
                :<></>}

                {this.state.isDataReturned?
                    <FeePaymentComponent currentPayment={this.state.payments[0]} handleProfileUpdate={this.handleProfileUpdate} customerId={this.state.id} currentPackage={this.state.currentPackage} currentFeeHistory={this.state.currentFeeHistory} />
                :<></>}
                
                
                
                
                            
            </div>
         );
    }
}
 
export default ProfilePage;
