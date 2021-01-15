import Axios from 'axios'
import { MDBDataTable } from 'mdbreact'
import React from 'react'
import { Line } from 'react-chartjs-2'
import { store } from 'react-notifications-component'
import { Link } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem, Card, CardBody, CardHeader } from 'reactstrap'


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

class ExtendHome extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data: [],
            isDataReturned: false
        }
    }

    componentDidMount(){
        Axios.get("https://fittzee-backend.herokuapp.com/customer/active/fetch/").then(dataReceived => {
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
                    rowItem["profile"] = <Link to={`/admin/extend/${id}`} className="btn px-3 py-2 ">Extend</Link>
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
        return(
            <div className="content">
                <div>
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Extend</BreadcrumbItem>
                    </Breadcrumb>
                </div>

                <Card>
                    <CardHeader>
                        <h4 className="mt-2 mb-0">Customers</h4>
                    </CardHeader>
                    <CardBody>
                        {this.state.isDataReturned ?
                            <CustomerTable rows={this.state.data} columns={columns}/>
                        :<></>}
                    </CardBody>
                </Card>
                 
            </div>
        )
    }
}

export default ExtendHome