import React, { Component } from 'react'
import { MDBDataTable } from 'mdbreact'
import Axios from 'axios'
import { Row, Col, Card, CardBody, Label, Button, ButtonDropdown } from 'reactstrap'
import Pagination from 'react-js-pagination'
import Swal from 'sweetalert2'
import { store } from 'react-notifications-component'




class EmployeeTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            documentCounts: 0,
            employeeData: [],
            isDataReturned: false,
            activePage: 1,
            numOfItems: 5,
            pageNum: 1
        }
    }

    fetchData = (pageNum = 1) => {
        Axios.get(`http://127.0.0.1:3005/employee/paginated/?numOfItems=${this.state.numOfItems}&pageNum=${pageNum}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}`
            }
        }).then(response => {
            console.log(response)

            if (response.data.statusCode === 200) {

                console.log(response.data)

                let rowsData = []
                for (var i = 0; i < response.data.paginatedData.length; i++) {
                    let rowItem = response.data.paginatedData[i]
                    rowItem["status"] = rowItem.status ? <span className="font-weight-bold">Active</span> : <span className="text-danger font-weight-bold">Inactive</span>
                    rowItem["editBtn"] = <Button onClick={this.handleEdit} className="btn btn-info py-2 px-3"> &#x270E;</Button>
                    rowItem["deleteBtn"] = <Button onClick={() => this.handleDelete(rowItem._id)} className="btn btn-danger py-2 px-3">x</Button>

                    rowsData.push(rowItem)
                }

                console.log(rowsData)

                this.setState({
                    employeeData: rowsData,
                    documentCounts: response.data.documentCounts,
                    isDataReturned: true
                })
            }

        }).catch(error => {
            console.log(error)
        })
    }

    componentWillMount() {
        this.fetchData()
    }


    handleDelete = (id) => {
        console.log(id)

        Swal.fire({
            title: "Delete Lead?",
            text: "You will not able to recover this data ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes. delete it!",
            cancelButtonText: "Cancel, keep it"
        }).then(result => {
            if (result.value) {

                Axios.delete(`http://127.0.0.1:3005/employee/delete/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('tokn')}`
                    }
                }).then(response => {
                    console.log(response)

                    if (response.data.statusCode === 200) {
                        console.log(response)
                    }

                }).catch(error => {
                    console.log(error)
                })

            } else if (result.dismiss === Swal.DismissReason.cancel) {
                store.addNotification({
                    title: 'Cancelled!',
                    message: 'Cancelled Successfully',
                    type: 'info',
                    insert: 'top',
                    container: 'top-right',
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                        duration: 2000,
                        onScreen: true
                    }
                })
            }
        })


    }

    handlePageChange = (pageNumber) => {
        console.log(`active page is ${pageNumber}`);
        this.setState({
            activePage: pageNumber
        });
        this.fetchData(pageNumber)
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
                label: 'Lead Count',
                field: 'leadsCount',
                sort: 'asc',
            },
            {
                label: 'Status',
                field: 'status',
                sort: 'asc',
            },
            {
                label: 'Salary',
                field: 'salary',
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
                                paging={false}
                                data={{
                                    columns: columnData,
                                    rows: this.state.employeeData
                                }}
                            />
                            <Pagination
                                itemClass="page-item"
                                linkClass="page-link"
                                activePage={this.state.activePage}
                                itemsCountPerPage={this.state.numOfItems}
                                totalItemsCount={this.state.documentCounts}
                                pageRangeDisplayed={5}
                                onChange={(val) => this.handlePageChange(val)}
                            />
                        </CardBody>
                    </Card>
                </div>
                : <></>
        )
    }
}

export default EmployeeTable
