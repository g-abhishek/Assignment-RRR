import React, { Component } from 'react';
// react plugin used to create charts
// import { Line, Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";
// reactstrap components
import { Card,CardHeader,CardBody,CardFooter,CardTitle,Row,Col,Button, Badge, Breadcrumb, BreadcrumbItem, Label,  Modal,ModalHeader, ModalBody,ModalFooter, Table} from "reactstrap";
import { Control, LocalForm, Errors } from 'react-redux-form';
// core components
import $ from 'jquery';
import { MDBDataTable, MDBDataTableV5 } from 'mdbreact';
import axios from 'axios'
import { ClipLoader } from 'react-spinners';
import { store } from 'react-notifications-component';
import Swal from 'sweetalert2'

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len)
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val)
const checkedSelected = (val) => (isNaN(Number(val)) || (val == undefined));
const isMobileNumber = (val) => !isNaN(Number(val)) && (val).toString().length == 10 && Number(val) > 0 && Number.isInteger(Number(val));
// const isMobileNumber = (val) => !isNaN(Number(val)) && (val).toString().length == 10;
const isNumber = (val) => !isNaN(Number(val)) && (val).toString().length >0 && Number(val) > 0 && Number.isInteger(Number(val));


const Users = [
  {
    urn:1,
    customer_name: "Abhishek",
    contact: 8830073205,
    batch: "6",
    profile: "active",
  },
  {
    urn:2,
    customer_name: "Firoz",
    contact: 5698236471,
    batch: "2",
    profile: "active",
  },
  {
    urn:3,
    customer_name: "Nasim",
    contact: 8830073205,
    batch: "6",
    profile: "active",
  },
  {
    urn:4,
    customer_name: "Rahul",
    contact: 8830073205,
    batch: "6",
    profile: "active",
  },
  {
    urn:5,
    customer_name: "Abhhek",
    contact: 8830073205,
    batch: "6",
    profile: "active",
  },
  {
    urn:6,
    customer_name: "Ravi",
    contact: 8830073205,
    batch: "5",
    profile: "active",
  },
  {
    urn:7,
    customer_name: "Suraj",
    contact: 8830073205,
    batch: "6",
    profile: "active",
  },
  {
    urn:8,
    customer_name: "Abdul",
    contact: 8830073205,
    batch: "6",
    profile: "active",
  },
]


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

  //   $(document).ready(function () {

  //     $("thead:not([data-test*='table-foot'])").remove()
  // });

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
        // checkboxFirstColumn
        // proCheckboxes
        // filledCheckboxes
        // proSelect
      />
    </>
  );
}

class EditPackage extends Component{
    constructor(props){
        super(props);
        this.state = {
            id:this.props.selected._id,
            packageName:this.props.selected.packageName,
            description: this.props.selected.description,
            months: this.props.selected.months,
            fees: this.props.selected.fees,
            type: this.props.selected.type,
            updatetDisabled: false,
            deleteDisabled: false,
        };
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props !== prevProps) {
          this.setState({
            id:this.props.selected._id,
            packageName:this.props.selected.packageName,
            description: this.props.selected.description,
            months: this.props.selected.months,
            fees: this.props.selected.fees,
            type: this.props.selected.type
          });
        }
    }

    handleUpdateSubmit = (values) => {

        var body = {
            packageName : this.state.packageName,
            description : this.state.description,
            months : this.state.months,
            fees : this.state.fees,
            type : this.state.type,
            user : localStorage.getItem('usr'),
        }

        Swal.fire({
            title: 'Update Pacakge?',
            // text: 'You will not be able to recover this data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'Cancel, keep it'
          }).then((result) => {
            if (result.value) {

                this.setState({
                  updatetDisabled: true
                })
                axios.put(`https://fittzee-backend.herokuapp.com/package/${this.state.id}`, body, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('tokn')}` 
                    } 
                })  
                .then((response) => {

                    this.setState({
                      updatetDisabled: false
                    })
                    // setResponse(response.data);
                    console.log("Response");
                    console.log(response)
                    if (response.data.statusCode === 200) {
                        console.log("Updated");
                        store.addNotification({
                            title: "Success!",
                            message: "Successfully Updated!",
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
                        this.props.handleUpdate();
                    }
                }).catch((error) => {

                    this.setState({
                      updatetDisabled: false
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

    handleDelete = async() => {


        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel, keep it'
          }).then((result) => {
            if (result.value) {

              this.setState({
                deleteDisabled: true
              })

                axios.delete(`https://fittzee-backend.herokuapp.com/package/${this.state.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('tokn')}`
                    }
                }
            ).then((response) => {
                this.setState({
                  deleteDisabled: false
                })
                console.log("Response");
                console.log(response)
                if (response.data.statusCode === 200) {
                    console.log("Del Success");
                    store.addNotification({
                        title: "Success!",
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
                    this.props.handleUpdate();
                }
            }).catch((e) => {
                this.setState({
                  deleteDisabled: false
                })
                console.log("Error is -")
                console.log(e)
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

    onChange = (e) =>{
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    render() {
    
        return (
          <>                
            <LocalForm onSubmit={(values) => this.handleUpdateSubmit(values)}>
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <p>Update/Delete Equipments</p>
                                <hr />
                                <Row className="form-group">
                                    <Label md={1} style={{fontSize:"1.2em"}}>Name:</Label>
                                    <Col md={4}>
                                        <Control.text model=".packageName" id="packageName" name="packageName"
                                            placeholder="Package Name" 
                                            // value={this.props.selected.equipmentName}
                                            defaultValue={this.state.packageName}
                                            value={this.state.packageName}
                                            onChange={this.onChange}
                                            className="form-control"
                                            validators={{
                                                required
                                            }}
                                        />
                                        <Errors 
                                            className="text-danger"
                                            model=".packageName"
                                            show="touched"
                                            messages={{
                                                required: 'Required!'
                                            }}
                                        />
                                    </Col>
                                    
                                    <Label md={2} style={{fontSize:"1.2em"}}>Description:</Label>
                                    <Col md={5}>
                                        <Control.text model=".description" id="description" name="description"
                                            placeholder="Description"   
                                            defaultValue={this.state.description}
                                            value={this.state.description}
                                            onChange={this.onChange}
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
                                                required: 'Required!'
                                            }}

                                        />
                                    </Col>

                                    
                                </Row>

                                <Row className="form-group">

                                    <Label md={1} style={{fontSize:"1.2em"}}>Type:</Label>
                                    <Col md={3}>
                                        <Control.select model=".type" id="type" name="type"
                                            // placeholder="Unique Reg. No."
                                            value={this.state.type}
                                            onChange={this.onChange}
                                            className="form-control"
                                        >
                                            <option value="Regular">Regular</option>
                                            <option value="Offer">Offer</option>
                                            <option value="GaPT">GaPT</option>
                                        </Control.select>
                                        
                                    </Col>
                                    
                                    <Label md={2} style={{fontSize:"1.2em"}}>Months:</Label>
                                    <Col md={2}>
                                        <Control.text model=".months" id="months" name="months"
                                            type="number"
                                            placeholder="Months"   
                                            defaultValue={this.state.months}
                                            value={this.state.months}
                                            onChange={this.onChange}
                                            className="form-control"
                                            validators={{
                                              isNumber
                                            }}
                                        />
                                        <Errors 
                                            className="text-danger"
                                            model=".months"
                                            show="touched"
                                            messages={{
                                              isNumber: 'Invalid Input!'
                                            }}

                                        />
                                    </Col>

                                    <Label md={1} style={{fontSize:"1.2em"}}>Fees:</Label>
                                    <Col md={3}>
                                        <Control.text model=".fees" id="fees" name="fees"
                                            type="number"
                                            placeholder="Fees"   
                                            value={this.state.fees}
                                            onChange={this.onChange}
                                            className="form-control"
                                            validators={{
                                              isNumber
                                            }}
                                        />
                                        <Errors 
                                            className="text-danger"
                                            model=".fees"
                                            show="touched"
                                            messages={{
                                              isNumber: 'Invalid Input!'
                                            }}

                                        />
                                    </Col>
                                    
                                </Row>
                                <hr />
                                
                                <Row className="form-group">
                                    <Col md={6}>
                                        <Button color="danger" id="delete" block onClick={this.handleDelete}>Delete</Button>
                                    </Col>
                                    <Col md={6}>
                                        <Button type="submit" outline block color="success">
                                            Update
                                        </Button>
                                    </Col>
                                </Row>
                            
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            
            </LocalForm>
    
          </>
        );
      }

}

class PackageCreate extends Component{
    constructor(props){
        super(props);
        this.state = {            
            submitDisabled: false
        }
    }

    handleSubmit = (values) => {

      this.setState({
        submitDisabled: true
      })

        var body = {
            packageName : values.packageName,
            description : values.description,
            months : values.months,
            fees : values.fees,
            type : values.type,
            user : localStorage.getItem('usr'),
        }

        axios.post(`https://fittzee-backend.herokuapp.com/package`, body, {
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
            if (response.data.statusCode === 200) {
                console.log("Created");
                store.addNotification({
                    title: "Success!",
                    message: "Package Created Successfully!",
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
                
                this.props.handleUpdate();
                $('#type').val('Regular');
                
            }
        }).catch((error) => {
            this.setState({
              submitDisabled: false
            })
            console.log("error");
            console.log(error)
            store.addNotification({
              title: "Error!",
              message: "Error While Creating Package!",
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

    onChange = (e) =>{
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    render() {
    
        return (
          <>                
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <h6>Create Package:</h6>
                                <hr />
                                <Row className="form-group">
                                    <Label md={1} style={{fontSize:"1.2em"}}>Name:</Label>
                                    <Col md={4}>
                                        <Control.text model=".packageName" id="packageName" name="packageName"
                                            placeholder="Package Name"   
                                            className="form-control"
                                            validators={{
                                                required
                                            }}
                                        />
                                        <Errors 
                                            className="text-danger"
                                            model=".packageName"
                                            show="touched"
                                            messages={{
                                                required: 'Required!'
                                            }}
                                        />
                                    </Col>
                                    
                                    <Label md={2} style={{fontSize:"1.2em"}}>Description:</Label>
                                    <Col md={5}>
                                        <Control.text model=".description" id="description" name="venddescriptionorName"
                                            placeholder="Description"   
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
                                                required: 'Required!'
                                            }}

                                        />
                                    </Col>
                                    
                                    

                                </Row>
                                
                                <Row className="form-group">
                                    <Label md={1} style={{fontSize:"1.2em"}}>Type</Label>
                                    <Col md={3}>
                                        <Control.select model=".type" id="type" name="type"
                                            // placeholder="Unique Reg. No."
                                            defaultValue="Regular"
                                            className="form-control"
                                            // validators={{
                                            //     checkedSelected
                                            // }}
                                        >
                                            {/* <option value={0} selected>Select Package Type...</option> */}
                                            <option value="Regular">Regular</option>
                                            <option value="GaPT">GaPT</option>
                                            <option value="MMA">MMA</option>
                                            <option value="Offer">Offer</option>
                                        </Control.select>
                                        {/* <Errors 
                                            className="text-danger"
                                            model=".type"
                                            show="touched"
                                            messages={{
                                                checkedSelected: "Required"
                                            }}

                                        /> */}
                                        
                                    </Col>

                                    <Label md={2} style={{fontSize:"1.2em"}}>Months:</Label>
                                    <Col md={2}>
                                        <Control.text model=".months" id="months" name="months"
                                            type="number"
                                            placeholder="Months"   
                                            className="form-control"
                                            validators={{
                                              isNumber
                                            }}
                                        />
                                        <Errors 
                                            className="text-danger"
                                            model=".months"
                                            show="touched"
                                            messages={{
                                              isNumber: 'Invalid Input!'
                                            }}

                                        />
                                    </Col>

                                    <Label md={1} style={{fontSize:"1.2em"}}>Fees:</Label>
                                    <Col md={3}>
                                        <Control.text model=".fees" id="fees" name="fees"
                                            type="number"
                                            placeholder="Fees"   
                                            className="form-control"
                                            validators={{
                                              isNumber
                                            }}
                                        />
                                        <Errors 
                                            className="text-danger"
                                            model=".fees"
                                            show="touched"
                                            messages={{
                                              isNumber: 'Invalid Input!'
                                            }}

                                        />
                                    </Col>
                                    
                                </Row>                                
                                <hr />
                                
                                <Row className="form-group">
                                    <Col md={6}>
                                        <Button color="danger" id="reset" block type="reset">Reset</Button>
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
    
          </>
        );
      }

}

class PackageTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isDataReturned: false,
    }
  }
    

  getClassData = async () => {
    const dataReceived = await axios.get(`https://fittzee-backend.herokuapp.com/package`)

    console.log(dataReceived)

    this.setState({
      data: dataReceived.data,
      isDataReturned: true

    })

  }

  componentWillMount = async () => {
    await this.getClassData();
  }

  async componentDidUpdate(prevProps){
      if(this.props.refresher !== prevProps.refresher){
          this.setState({
              data: this.props.data,
              isDataReturned: this.props.isDataReturned
          })
          await this.getClassData();
      }
  }

  componentDidMount() {

    var x = document.getElementsByTagName("tr");
    console.log(x)
    $(x).click(function (e) {
      console.log(e.target);
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
      <>
        
        <CardHeader>
            <h4 className="mt-3 mb-0">Packages</h4>            
        </CardHeader>
        <CardBody>
            {this.state.isDataReturned ? <WithCheckBoxesEnd handleSelect={this.props.handleSelect} columns={columns} rows={this.state.data} /> : 
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

        </CardBody>
         
      </>
    );
  }
}

class Packages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {},
      refresher:0
    }
  }

  handleSelect = (obj) => {
    this.setState({
            selected:obj,
        });
    }

  handleUpdate = () => {
    this.setState({
        refresher: this.state.refresher+1,
        selected: {}
    })
}

  componentDidMount() {

    var x = document.getElementsByTagName("tr");
    console.log(x)
    $(x).click(function (e) {
      console.log(e.target);
    })

  }


  render() {

    return (
      <>
        <div className="content">
            <div>
                <Breadcrumb>
                <BreadcrumbItem><Link to='/'>Home</Link></BreadcrumbItem>
                <BreadcrumbItem active>Packages</BreadcrumbItem>
                </Breadcrumb>
            </div>

            <PackageCreate handleUpdate={this.handleUpdate} />           
            <hr />

            <Card>
                <PackageTable refresher={this.state.refresher} handleSelect={this.handleSelect} />
            </Card>
            <hr />

            
            {JSON.stringify(this.state.selected) !== '{}' ? <EditPackage handleUpdate={this.handleUpdate} selected={this.state.selected} /> : <></>}
            

        </div>
      </>
    );
  }
}

export default Packages;