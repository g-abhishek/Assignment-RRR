import React, { Component } from 'react';
// react plugin used to create charts
// import { Line, Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";
// reactstrap components
import { Card, CardBody, CardFooter, CardTitle, Row, Col, Breadcrumb, BreadcrumbItem, CardHeader, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
// core components
import $ from 'jquery';
import { MDBDataTable, MDBDataTableV5 } from 'mdbreact';
import axios from 'axios'
import { Control, Errors, LocalForm } from 'react-redux-form';
import { ClipLoader } from 'react-spinners';
import { store } from 'react-notifications-component';

const required = (val) => val && val.length;


function WithCheckBoxesEnd(props) {

  const [datatable, setDatatable] = React.useState({
    columns: props.columns,
    rows: props.rows
  });


  const [checkbox1, setCheckbox1] = React.useState('');

  const showLogs2 = (e) => {
    setCheckbox1(e);
  };

  //   $(document).ready(function () {

  //     $("thead:not([data-test*='table-foot'])").remove()
  // });

  return (
    <>
      <MDBDataTable
        // striped
        hover
        bordered
        entries={20}
        small
        data={datatable}
      />
      {/* <MDBDataTableV5
        hover
        entriesOptions={[5, 20, 25]}
        entries={5}
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
      /> */}

      <div> {checkbox1 && <p>{JSON.stringify(delete checkbox1.checkbox && checkbox1)}</p>}</div>
      {console.log(checkbox1)}
    </>
  );
}

class StudentHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isDataReturned: false,
      isModalOpen: false
    }
  }

  toggleModal = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    })
  }

  getClassData = async () => {
    const dataReceived = await axios.get(`https://fittzee-backend.herokuapp.com/customer/registrations/fetch`)

    console.log(dataReceived)
    if (dataReceived.data.statusCode == 404) {
      store.addNotification({
          title: "Not Found!",
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
    }
    if (dataReceived.data.statusCode == 200) {
      let rowsData = []
      for (var index = 0; index < dataReceived.data.result.length; index++) {
        let rowItem = dataReceived.data.result[index]
        const id = dataReceived.data.result[index]._id

        rowItem["active"] = dataReceived.data.result[index].active && dataReceived.data.result[index].packages.length>0 ? "Active" : <span className="text-danger font-weight-bold">Inactive</span>
        rowItem["startDate"] = dataReceived.data.result[index].packages.length>0 ? dataReceived.data.result[index].packages[0].startDate : "N/A"
        rowItem["endDate"] = dataReceived.data.result[index].packages.length>0 ? dataReceived.data.result[index].packages[0].endDate : "N/A"
        rowItem["sessions"] = dataReceived.data.result[index].packages.length>0 ? dataReceived.data.result[index].packages[0].totalDays : "N/A"
        rowItem["profile"] = <Link to={`/admin/customers/${id}`} className="btn px-3 py-2 ">View</Link>
        rowsData.push(rowItem)

      }
      console.log(rowsData)

      this.setState({
        data: rowsData,
        isDataReturned: true

      })
    }



    

  }

  componentWillMount = async () => {
    await this.getClassData();
  }



  render() {

    const columns = [
      {
        label: 'Name',
        field: 'customerName',
        sort: 'asc'

      },
      {
        label: 'Contact',
        field: 'mobile',
        sort: 'asc'
      },
      {
        label: 'Start Date',
        field: 'startDate',
        sort: 'asc'
      },
      {
        label: 'End Date',
        field: 'endDate',
        sort: 'asc'
      },
      {
        label: 'Status',
        field: 'active',
        sort: 'asc'
      },
      {
        label: 'Sessions',
        field: 'sessions',
        sort: 'asc'
      },
      {
        label: 'Profile',
        field: 'profile'
      }
    ];

    return (
      <>
        <div className="content">
          <div>
            <Breadcrumb>
              <BreadcrumbItem><Link to='/'>Home</Link></BreadcrumbItem>
              <BreadcrumbItem active>Customers</BreadcrumbItem>
            </Breadcrumb>
          </div>

          <Card>
            <CardHeader>
              <h4 className="mt-2 mb-0">Customers</h4>
              
            </CardHeader>
            <CardBody>

              {this.state.isDataReturned ? 
                <WithCheckBoxesEnd columns={columns} rows={this.state.data} />               
              : 
                <div className="sweet-loading text-center">
                    <ClipLoader 
                      size={40}
                      color={"#009dff"}
                      loading = {true}
                    />
                </div>              
              }

            </CardBody>
          </Card>
          <hr />

          

        </div>
      </>
    );
  }
}

export default StudentHome;
