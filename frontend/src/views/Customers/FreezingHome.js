import React from 'react'
import Axios from 'axios'
import { MDBDataTable } from 'mdbreact'
import { Line } from 'react-chartjs-2'
import { store } from 'react-notifications-component'
import { Link } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem, Button, Card, CardBody, CardHeader } from 'reactstrap'
import { ClipLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import { data } from 'jquery'


function CustomerTable(props){

    const [dataTable, setDataTable] = React.useState({
        columns: props.columns,
        rows: props.rows
    })


    return(
        <MDBDataTable 
            hover
            bordered
            entries = {20}
            data = {dataTable}
        />
    )
}

function FreezedCustomerTable(props){

    const [dataTable, setDataTable] = React.useState({
        columns: props.columns,
        rows: props.rows
    })


    return(
        <MDBDataTable 
            hover
            bordered
            entries = {20}
            data = {dataTable}
        />
    )
}

class FreezingHome extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data: [],
            freezedData: [],
            isDataReturned: false,
            isFreezedDataReturned: false,
        }
    }

    getUserData = () => {
        Axios.get("https://fittzee-backend.herokuapp.com/customer/active/freeze/fetch/", {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}` 
            } 
        }).then(dataReceived => {
            console.log(dataReceived)
            if(dataReceived.data.statusCode == 200){
                let rowsData = []
                for (var index = 0; index < dataReceived.data.result.length; index++) {
                    let rowItem = dataReceived.data.result[index]
                    const id = dataReceived.data.result[index]._id

                    rowItem["active"] = dataReceived.data.result[index].active ? <span className="font-weight-bold">Active</span> : <span className="text-danger font-weight-bold">Inactive</span>
                    rowItem["startDate"] = dataReceived.data.result[index].startDate ? dataReceived.data.result[index].startDate : "N/A"
                    rowItem["endDate"] = dataReceived.data.result[index].endDate ? dataReceived.data.result[index].endDate : "N/A"
                    rowItem["totalDays"] = dataReceived.data.result[index].totalDays ? dataReceived.data.result[index].totalDays : "N/A"
                    rowItem["profile"] = <Link to={`/admin/freeze/${id}`} className="btn px-3 py-2 ">Freeze</Link>
                    rowsData.push(rowItem)

                }
                console.log(rowsData)

                this.setState({
                    data: rowsData,
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

    UnFreeze =(id)=> {
        console.log(id)
        Swal.fire({
            title: 'Update Enquiry?',
            // text: 'You will not be able to recover this data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'Cancel, keep it'
          }).then((result) => {
            if (result.value) {
                Axios.put(`https://fittzee-backend.herokuapp.com/customer/unfreeze/${id}`,
                    {
                        freezed: false
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('tokn')}`
                        }
                    }
                ).then((response) => {
                    console.log("Response");
                    console.log(response)
                    if (response.data.statusCode === 403) {
                        store.addNotification({
                            title: "Invalid Id!",
                            message: "Invalid User Id!",
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
                    if (response.data.statusCode === 200) {
                        console.log("Updated Success");
                        store.addNotification({
                            title: "UnFreezed!",
                            message: "UnFreezed Successfully!",
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
                        this.setState({
                            freezedData: [],
                            isFreezedDataReturned:false,
                            data: [],
                            isDataReturned:false
                        })
                        this.getFreezedUserData();
                        this.getUserData();
                    }
                }).catch((e) => {
                    console.log("Error is -")
                    console.log(e)
                    store.addNotification({
                        title: "Error!",
                        message: "Error While Unfreezing!",
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

    getFreezedUserData = () => {
        Axios.get("https://fittzee-backend.herokuapp.com/customer/freezed/fetch/", {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}` 
            } 
        }).then(dataReceived => {
            console.log(dataReceived)
            if(dataReceived.data.statusCode == 200){
                let rowsData = []
                for (var index = 0; index < dataReceived.data.result.length; index++) {
                    let rowItem = dataReceived.data.result[index]
                    const id = dataReceived.data.result[index]._id

                    rowItem["freezed"] = dataReceived.data.result[index].freezed ? <span className="font-weight-bold text-info">Freezed</span> : <span className="text-danger font-weight-bold">Inactive</span>
                    rowItem["startDate"] = dataReceived.data.result[index].startDate ? dataReceived.data.result[index].startDate : "N/A"
                    rowItem["endDate"] = dataReceived.data.result[index].endDate ? dataReceived.data.result[index].endDate : "N/A"
                    rowItem["totalDays"] = dataReceived.data.result[index].totalDays ? dataReceived.data.result[index].totalDays : "N/A"
                    rowItem["profile"] = <Button onClick={this.UnFreeze.bind(this, id)} className="btn px-3 py-2 ">UnFreeze</Button>
                    rowsData.push(rowItem)

                }
                console.log(rowsData)

                this.setState({
                    freezedData: rowsData,
                    isFreezedDataReturned: true

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
        this.getFreezedUserData()
    }

    render(){
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
              field: 'totalDays',
              sort: 'asc'
            },
            {
              label: 'Profile',
              field: 'profile'
            }
          ];

        const freezedColumns = [
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
              field: 'freezed',
              sort: 'asc'
            },
            {
              label: 'Sessions',
              field: 'totalDays',
              sort: 'asc'
            },
            {
              label: 'Profile',
              field: 'profile'
            }
          ];
        return(
            <div className="content">
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Freeze</BreadcrumbItem>
                </Breadcrumb>

                <Card>
                    <CardHeader>
                        <h4 className="mt-2 mb-0">Customers</h4>
                    </CardHeader>
                    <CardBody>
                        {this.state.isDataReturned ?
                            <CustomerTable rows={this.state.data} columns={columns}/>
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

                <hr className="my-5"/>


                <Card>
                    <CardHeader>
                        <h4 className="mt-2 mb-0">Freezed Customers</h4>
                    </CardHeader>
                    <CardBody>
                        {this.state.isFreezedDataReturned ?
                            <FreezedCustomerTable rows={this.state.freezedData} columns={freezedColumns}/>
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

                
                 
            </div>
        )
    }
}

export default FreezingHome