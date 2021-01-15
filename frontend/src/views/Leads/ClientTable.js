import React, { Component } from 'react'
import { MDBDataTable } from 'mdbreact'
import Axios from 'axios'
import { Row, Col, Card, CardBody, Label, Button, ButtonDropdown } from 'reactstrap'




class ClientTable extends Component {
    constructor(props){
        super(props)
        this.state = {
            leadsData: [],
            isDataReturned: false
        }
    }

    componentWillMount(){
        Axios.get("http://127.0.0.1:3005/lead/getallleads", {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}`
            }
        }).then(response => {
            console.log(response)

            if(response.data.statusCode === 200){
                

                let rowsData = []
                for(var i = 0; i< response.data.result.length; i++){
                    let rowItem = response.data.result[i]
                    rowItem["convertBtn"] = <Button onClick={this.handleConvert} className="btn btn-success py-2 px-3">&#10003;</Button>
                    rowItem["editBtn"] = <Button onClick={this.handleEdit} className="btn btn-info py-2 px-3"> &#x270E;</Button>
                    rowItem["deleteBtn"] = <Button onClick={() => this.handleDelete(rowItem._id)} className="btn btn-danger py-2 px-3">x</Button>

                    rowsData.push(rowItem)
                }


                this.setState({
                    leadsData: rowsData,
                    isDataReturned: true
                })
            }

        }).catch(error => {
            console.log(error)
        })
    }


    handleDelete =(id) => {
        console.log(id)
        Axios.put(`http://127.0.0.1:3005/lead/delete`, {id: id}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}`
            }
        }).then(response => {
            console.log(response)

            if(response.data.statusCode === 200){
                console.log(response)
            }

        }).catch(error => {
            console.log(error)
        })
    }

    render() {

        const columnData = [
            {
                label: 'First Name',
                field: 'fname',
                sort: 'asc',
            },
            {
                label: 'Last Name',
                field: 'lname',
                sort: 'asc',
            },
            {
                label: 'Contact',
                field: 'contact',
                sort: 'asc',
            },
            {
                label: 'Email',
                field: 'email',
                sort: 'asc',
            },
            {
                label: 'Follow Up',
                field: 'followUpDate',
                sort: 'asc',
            },
            {
                label: 'Convert',
                field: 'convertBtn',
                sort: 'asc',
            },
            {
                label: 'Edit',
                field: 'editBtn',
                sort: 'asc',
            },
            {
                label: 'Delete',
                field: 'deleteBtn',
                sort: 'asc',
            },
        ]
        



        return (
            this.state.isDataReturned ?
            <div className="content">
                <Card>
                    <CardBody>                    
                        <MDBDataTable 
                            hover
                            bordered
                            entries={20}
                            data = {{
                                columns: columnData,
                                rows: this.state.leadsData
                            }}
                        />
                    </CardBody>
                </Card>
            </div>
            :<></>
        )
    }
}

export default ClientTable
