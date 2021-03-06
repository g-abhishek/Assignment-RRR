import React, { Component } from 'react'
import { MDBDataTable } from 'mdbreact'
import Axios from 'axios'
import { Row, Col, Card, CardBody, Label, Button, ButtonDropdown } from 'reactstrap'
import Pagination from 'react-js-pagination'
import Swal from 'sweetalert2'
import { store } from 'react-notifications-component'
import { Link } from 'react-router-dom'




class ClientTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            documentCounts: 0,
            leadsData: [],
            isDataReturned: false,
            activePage: 1,
            numOfItems: 5
        }
    }

    fetchData = (pageNum = 1) => {
        Axios.get(`http://127.0.0.1:3005/client/paginated/?numOfItems=${this.state.numOfItems}&pageNum=${pageNum}`, {
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
                    // rowItem["convertBtn"] = <Button onClick={() => this.handleConvert(rowItem._id)} className="btn btn-success py-2 px-3">&#10003;</Button>
                    rowItem["editBtn"] = <Link to={`/employee/clients/${rowItem._id}`} className="btn btn-info py-2 px-3"> &#x270E;</Link>
                    rowItem["deleteBtn"] = <Button  className="btn btn-danger py-2 px-3">x</Button>

                    rowsData.push(rowItem)
                }

                console.log(rowsData)

                this.setState({
                    leadsData: rowsData,
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

        const prevLeadsData = this.state.leadsData;        

        Swal.fire({
            title: "Delete Lead?",
            text: "You will not able to recover this data ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes. delete it!",
            cancelButtonText: "Cancel, keep it"
        }).then(result => {
            if (result.value) {

                this.setState({
                    leadsData: this.state.leadsData.filter(user => user._id !== id)
                })

                Axios.put(`http://127.0.0.1:3005/lead/delete`, { id: id }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('tokn')}`
                    }
                }).then(response => {
                    console.log(response)

                    if(response.data.statusCode === 401){
                        store.addNotification({
                            title: "Failed!",
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
                        console.log(response)
                        store.addNotification({
                            title: "Success!",
                            message: "Deleted Successfully!",
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
                    }

                }).catch(error => {
                    console.log(error)
                    this.setState({
                        leadsData: prevLeadsData
                    })
                    store.addNotification({
                        title: "Error!",
                        message: "Internal Server Error!",
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


    // handleConvert = (id) => {
    //     console.log(id)

    //     const prevLeadsData = this.state.leadsData;        

    //     Swal.fire({
    //         title: "Convert Lead?",
    //         text: "Are you sure you want to convert thi lead to client?",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonText: "Yes. Convert it!",
    //         cancelButtonText: "Cancel, keep it"
    //     }).then(result => {
    //         if (result.value) {

    //             this.setState({
    //                 leadsData: this.state.leadsData.filter(user => user._id !== id)
    //             })

    //             Axios.put(`http://127.0.0.1:3005/lead/convert/client/`, { id: id }, {
    //                 headers: {
    //                     'Authorization': `Bearer ${localStorage.getItem('tokn')}`
    //                 }
    //             }).then(response => {
    //                 console.log(response)

    //                 if(response.data.statusCode === 401){
    //                     store.addNotification({
    //                         title: "Failed!",
    //                         message: response.data.message,
    //                         type: "danger",
    //                         insert: "top",
    //                         container: "top-right",
    //                         animationIn: ["animated", "fadeIn"],
    //                         animationOut: ["animated", "fadeOut"],
    //                         dismiss: {
    //                           duration: 2000,
    //                           onScreen: true
    //                         }
    //                     });
    //                 }

    //                 if (response.data.statusCode === 200) {
    //                     console.log(response)
    //                     store.addNotification({
    //                         title: "Success!",
    //                         message: "Converted Successfully!",
    //                         type: "success",
    //                         insert: "top",
    //                         container: "top-right",
    //                         animationIn: ["animated", "fadeIn"],
    //                         animationOut: ["animated", "fadeOut"],
    //                         dismiss: {
    //                           duration: 2000,
    //                           onScreen: true
    //                         }
    //                     });
    //                 }

    //             }).catch(error => {
    //                 console.log(error)
    //                 this.setState({
    //                     leadsData: prevLeadsData
    //                 })
    //                 store.addNotification({
    //                     title: "Error!",
    //                     message: "Internal Server Error!",
    //                     type: "info",
    //                     insert: "top",
    //                     container: "top-right",
    //                     animationIn: ["animated", "fadeIn"],
    //                     animationOut: ["animated", "fadeOut"],
    //                     dismiss: {
    //                     duration: 2000,
    //                     onScreen: true
    //                     }
    //                 });
    //             })

    //         } else if (result.dismiss === Swal.DismissReason.cancel) {
    //             store.addNotification({
    //                 title: 'Cancelled!',
    //                 message: 'Cancelled Successfully',
    //                 type: 'info',
    //                 insert: 'top',
    //                 container: 'top-right',
    //                 animationIn: ["animated", "fadeIn"],
    //                 animationOut: ["animated", "fadeOut"],
    //                 dismiss: {
    //                     duration: 2000,
    //                     onScreen: true
    //                 }
    //             })
    //         }
    //     })


    // }

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
            // {
            //     label: 'Follow Up',
            //     field: 'followUpDate',
            //     sort: 'asc',
            // },
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
                                    rows: this.state.leadsData
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

export default ClientTable
