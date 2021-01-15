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


    // to hide table footer for mdbtable
    $(document).ready(function () {
        $("thead:not([data-test*='datatable-head'])").css("display","none")
    });

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

class PendingUsers extends Component {
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
    const dataReceived = await axios.get(`https://fittzee-backend.herokuapp.com/customer/inactive/fetch`)

    console.log(dataReceived)
    console.log(dataReceived.data[0]._id)



    let rowsData = []
    for (var index = 0; index < dataReceived.data.length; index++) {
      let rowItem = dataReceived.data[index]

      rowItem["active"] = dataReceived.data[index].active ? "Active" : <span className="text-danger font-weight-bold">Inactive</span>
      rowItem["profile"] = <Link to={`/admin/customers/${dataReceived.data[index]._id}`} className="btn px-3 py-2 ">View</Link>
      rowsData.push(rowItem)

    }
    console.log(rowsData)

    this.setState({
      data: rowsData,
      isDataReturned: true

    })

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
        label: 'Status',
        field: 'active',
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
              <BreadcrumbItem active>Inactive</BreadcrumbItem>
            </Breadcrumb>
          </div>

          <Card>
            <CardHeader>
              <h4 className="mt-2 mb-0">Inactive Customers</h4>
              
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

export default PendingUsers;
