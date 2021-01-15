import React, { Component, Fragment } from 'react';
import { Card,CardHeader,CardBody,CardFooter,CardTitle,Row,Col,Button, Badge, Breadcrumb, BreadcrumbItem} from "reactstrap";
import { Link } from "react-router-dom";
// import readXlsxFile from 'read-excel-file'
import $ from 'jquery';
import axios from 'axios'
import { Control, LocalForm, Errors } from 'react-redux-form';

import { MDBDataTable } from 'mdbreact';

import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import { store } from 'react-notifications-component';

const required = (val) => val && val.length;

const ShowTable = (props) => {
    const [datatable, setDatatable] = React.useState({
      columns: props.columns,
      rows: props.rows,
    });
    const [checkbox1, setCheckbox1] = React.useState('');
  
    const showLogs2 = (e) => {
      setCheckbox1(e);
      props.handleSelect(e);
      
    };

    $(document).ready(function () {
        $("thead:not([data-test*='table-foot'])").remove()
    });
    
    return (
      <>
        <MDBDataTable
          hover
          entriesOptions={[10, 20, 25]}
          entries={10}
          data={datatable}
        />
  
      </>
    );
  }

class AlreadyAdmissions extends Component {
    // state = {  }
    constructor(props){
        super(props);
        this.state = {
            rows: '',
            cols: '',
            dataReceived: 0,
            data:[]
        }
    }

    handleExcelSubmit = (values) => {
        console.log(values.excel[0])

        this.setState({dataReceived:1});
        
        const formData = new FormData();
        formData.append("file", values.excel[0]);
        formData.append("user", localStorage.getItem('usr'))

        axios.post(`https://fittzee-backend.herokuapp.com/customer/excel/registrations`, formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}` 
            } 
        })  
        .then((response) => {
            // setResponse(response.data);
            console.log("Response");
            console.log(response)
            if (response.data.statusCode === 200) {
                console.log("Created");

                this.setState({
                    dataReceived: 2,
                    data: response.data.adm
                })
                // // Resset the form!
                document.getElementById('excel').value = '';
            }
            if (response.data.statusCode === 403) {
                console.log("duplication error");

                store.addNotification({
                    title: "Duplication error!",
                    message: response.data.message,
                    type: "info",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true
                    }
                  });

                this.setState({
                    dataReceived: 5,
                })
                // // Resset the form!
                document.getElementById('excel').value = '';
            }
        }).catch((error) => {
            console.log("error");
            console.log(error)
            store.addNotification({
                title: "Server Error!",
                message: "Something Went Wrong!",
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
        $(document).ready(function () {
    
          $("thead:not([data-test*='table-foot'])").remove()
      });
      }

    render() { 
        const columns = [
            {
                label: 'Name',
                field: 'customerName',
                sort: 'asc'
            },
            {
                label: 'Mobile',
                field: 'mobile',
                sort: 'asc'
            },
            {
                label: 'Gender',
                field: 'gender',
                sort: 'asc'
            },
            {
                label: 'DOB',
                field: 'dob',
                sort: 'asc'
            },
            {
                label: 'Email',
                field: 'email',
                sort: 'asc'
            },
        ];
        return ( 
            <>
                <div className="content">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/'>Home</Link></BreadcrumbItem>
                        {/* <BreadcrumbItem><Link to='/admin/student'>Student</Link></BreadcrumbItem> */}
                        <BreadcrumbItem active>Already Admissions</BreadcrumbItem>
                    </Breadcrumb>
                    
                    <Row>
                        <Col md={5}>
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h5">Previous Admissions:</CardTitle>
                                    <p className="card-category">Submit data using given excel template</p>                
                                </CardHeader>
                                <CardBody>
                                    Excel Template: {' '}<a href={require('./../../assets/excel/excel-template.xlsx')} style={{color:"green"}} download>{' '} &nbsp; Download &nbsp; <span style={{color:"green"}} className="fas fa-file-excel"></span></a>
                                    <hr />
                                    Submit Data: 
                                        <LocalForm onSubmit={(values) => this.handleExcelSubmit(values)}>
                                            <Row className="form-group">
                                                <Col md={12}>
                                                    <Control.file model=".excel" id="excel" name="excel"
                                                        className="form-control"
                                                        validators={{
                                                            required
                                                        }}
                                                            />
                                                    <Errors 
                                                        className="text-danger"
                                                        model=".excel"
                                                        show="touched"
                                                        messages={{
                                                            required: 'Required! '
                                                        }}

                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="form-group">
                                                <Col>
                                                    <Button type="submit" outline color="primary">
                                                        Submit
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </LocalForm>
                                    {/* <input type="file" onChange={this.fileHandler.bind(this)} style={{"padding":"10px"}} /> */}
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <CardHeader>The Uploaded Data:</CardHeader>
                                <hr />
                                <CardBody>
                                    {this.state.dataReceived===2 ? 
                                        <Fragment>
                                            <ShowTable rows={this.state.data} columns={columns}/>
                                        </Fragment>
                                        : 
                                        <>
                                            {this.state.dataReceived===1 ?
                                                <div className="sweet-loading text-center">
                                                    <ClipLoader
                                                        // css={override}
                                                        size={35}
                                                        color={"#009dff"}
                                                        loading={true}
                                                    />
                                                </div>
                                                : <p>Nothing to show...</p>
                                            }
                                        </>
                                    }
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>        
            </>
        );
    }
}
 
export default AlreadyAdmissions;
