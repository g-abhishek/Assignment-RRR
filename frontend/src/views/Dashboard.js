import React from "react";
// react plugin used to create charts
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";
// reactstrap components
import { Card,CardHeader,CardBody,CardFooter,CardTitle,Row,Col} from "reactstrap";
import CountUp from 'react-countup';
// core components


import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

import { topCards } from './../components/Shared/dashboardCards.js'
import axios from "axios";

class Dashboard extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentMonthRegistered: 0,
      pendingUsersCount: 0,
      active: 0,
      inactive: 0,
      CurrentYearRegistered: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  }


  getRegisteredCount = () => {
    axios.get('https://fittzee-backend.herokuapp.com/student/customers/async/fetch/').then(dataReceived =>{
      this.setState({
        currentMonthRegistered: dataReceived.data.currentMonthRegistered,
        pendingUsersCount: dataReceived.data.pendingUsersCount,
        active: dataReceived.data.active,
        inactive: dataReceived.data.inactive,
      })
    }).catch(error =>{
      console.log(error)
    })
  }

  CurrentYearRegistered = () => {
    axios.get('https://fittzee-backend.herokuapp.com/student/registered/current/year/').then(dataReceived =>{

      let yearArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      for(var i=0; i < dataReceived.data.length; i++){
        yearArray[dataReceived.data[i].month - 1] += dataReceived.data[i].count  
      }
      console.log(yearArray)      
      this.setState({
        CurrentYearRegistered: yearArray
      })
    }).catch(error =>{
      console.log(error)
    })
  }

  componentDidMount(){

    this.getRegisteredCount()
    this.CurrentYearRegistered()


    // store.addNotification({
    //   title: "Welcome " + JSON.parse(localStorage.getItem('usr')).name +"!",
    //   message: "- by Assignment!",
    //   type: "default",
    //   insert: "top",
    //   container: "top-right",
    //   animationIn: ["animated", "fadeIn"],
    //   animationOut: ["animated", "fadeOut"],
    //   dismiss: {
    //     duration: 1000,
    //     onScreen: true
    //   }
    // });
  }

  render() {

    const state = {
      labels: ['Active', 'Inactive'],
      datasets: [
        {
          label: 'users',
          // pointRadius: 0,
          // pointHoverRadius: 0,
          backgroundColor: [
            "#4acccd", "#ef8157"
          ],
          hoverBackgroundColor: [
          '#39e7e8',
          '#ff6023',
          ],
          data: [this.state.active, this.state.inactive]
        }
      ]
    }

    const yearState = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Users',
          backgroundColor: '#fcc468',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 1,
          data: this.state.CurrentYearRegistered
        }
      ]
    }


    return (
      <>
        <div className="content">
        <h4>Cards :</h4>
          <Row>
          
          {topCards.map((item)=>{

            return (
              <Col lg="3" md="6" sm="6" key={item.id}>
                <Link to={item.link} style={{textDecoration:"none"}}>
                  <Card className="card-stats">
                    <CardBody style={{fontSize:"0.7em"}}>
                      <Row>
                        <Col md="4" xs="5">
                          <div className="icon-big text-center icon-warning">
                            <i className={item.icon} /> 
                          </div>
                        </Col>
                        <Col md="8" xs="7">
                          <div className="numbers">
                            <CardTitle>{item.label}</CardTitle>
                            <p className="card-category">{item.tag}</p>
                            <p />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                    <CardFooter>
                      <hr />
                      <div className="stats">
                        <Link to={item.link}>
                          <i className="fas fa-sync-alt" /> {item.linkName}
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </Col>
            );
            
          })}
        </Row>

        <hr />
        <h4>Accounts:</h4>
        <Row>

        <Col lg="3" md="6" sm="6" >
            <Link style={{textDecoration:"none"}}>
              <Card className="card-stats">
              <CardBody style={{fontSize:"0.7em"}}>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-chart-bar-32 text-primary" /> 
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <CardTitle><CountUp end={this.state.currentMonthRegistered} /></CardTitle>
                        <p className="card-category">This Month</p>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    {/* <Link>
                      <i className="fas fa-sync-alt" /> 
                    </Link> */}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </Col>

        <Col lg="3" md="6" sm="6" >
            <Link to={"/admin/pending"} style={{textDecoration:"none"}}>
              <Card className="card-stats">
              <CardBody style={{fontSize:"0.7em"}}>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-money-coins text-warning" /> 
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <CardTitle><CountUp end={this.state.pendingUsersCount} /></CardTitle>
                        <p className="card-category">Fees Pending</p>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    {/* <Link>
                      <i className="fas fa-sync-alt" /> 
                    </Link> */}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </Col>

        <Col lg="3" md="6" sm="6" >
            <Link to={'/admin/customers'} style={{textDecoration:"none"}}>
              <Card className="card-stats">
              <CardBody style={{fontSize:"0.7em"}}>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-tap-01 text-success" /> 
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <CardTitle><CountUp end={this.state.active} /></CardTitle>
                        <p className="card-category">Active Users</p>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    {/* <Link>
                      <i className="fas fa-sync-alt" /> 
                    </Link> */}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </Col>

        <Col lg="3" md="6" sm="6" >
            <Link to={'/admin/inactive'} style={{textDecoration:"none"}}>
              <Card className="card-stats">
              <CardBody style={{fontSize:"0.7em"}}>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-alert-circle-i text-danger" /> 
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <CardTitle><CountUp end={this.state.inactive} /></CardTitle>
                        <p className="card-category">Inactive Users</p>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    {/* <Link>
                      <i className="fas fa-sync-alt" /> 
                    </Link> */}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </Col>

          
        </Row>
        <hr />

          <Row>
            <Col md="5">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Active/Inactive Distribution</CardTitle>
                  <p className="card-category">Based on Current Packages</p>
                </CardHeader>
                <CardBody>
                  <Doughnut
                    data={state}
                    options={{
                      // animation: {
                      //     duration: 5000,
                      // },
                      title:{
                        display:false,
                        // text:'Average Rainfall per month',
                        // fontSize:20
                      },
                      legend:{
                        display:false,
                        // position:'right'
                      }
                    }}
                  />
                </CardBody>
                <CardFooter>
                  <div className="legend">
                    <i className="fa fa-circle text-primary" style={{padding:"5px"}} /> Active{"   "}
                    <i className="fa fa-circle text-danger" style={{padding:"5px"}}/> Inactive{"   "}
                  </div>
                  <hr />
                  <div className="stats">
                    <i className="fa fa-calendar" /> Number of active/inactive users
                  </div>
                </CardFooter>
              </Card>
            </Col>
            
            <Col md="7">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Users Registrations</CardTitle>
                  <p className="card-category">Yearly based performance</p>
                </CardHeader>
                <CardBody>
                  <Bar
                    data={yearState}
                    options={{
                      // animation: {
                      //     duration: 5000,
                      // },
                      title:{
                        display:false,
                        // text:'Average Rainfall per month',
                        // fontSize:20
                      },
                      legend:{
                        display:false,
                        // position:'right'
                      },
                    }}
                  />
                </CardBody>
                {/* <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="fa fa-history" /> Updated 3 minutes ago
                  </div>
                </CardFooter> */}
              </Card>
            </Col>
            
            {/* <Col md="6">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Datasets Distribution</CardTitle>
                  <p className="card-category">Based on Validation accuracy</p>
                </CardHeader>
                <CardBody>
                  <Doughnut
                    data={dashboardEmailStatisticsChart.data}
                    options={dashboardEmailStatisticsChart.options}
                  />
                </CardBody>
                <CardFooter>
                  <div className="legend">
                    <i className="fa fa-circle text-primary" style={{padding:"5px"}} /> Art{"   "}
                    <i className="fa fa-circle text-warning" style={{padding:"5px"}}/> Deaf{"   "}
                    <i className="fa fa-circle text-danger" style={{padding:"5px"}}/> I{"   "}
                    <i className="fa fa-circle text-gray" style={{padding:"5px"}}/> Clear
                  </div>
                  <hr />
                  <div className="stats">
                    <i className="fa fa-calendar" /> Number of emails sent
                  </div>
                </CardFooter>
              </Card>
            </Col> */}
            
            {/* <Col md="6">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h5">NASDAQ: AAPL</CardTitle>
                  <p className="card-category">Line Chart with Points</p>
                </CardHeader>
                <CardBody>
                  <Line
                    data={dashboardNASDAQChart.data}
                    options={dashboardNASDAQChart.options}
                    width={400}
                    height={100}
                  />
                </CardBody>
                <CardFooter>
                  <div className="chart-legend">
                    <i className="fa fa-circle text-info" /> Tesla Model S{" "}
                    <i className="fa fa-circle text-warning" /> BMW 5 Series
                  </div>
                  <hr />
                  <div className="card-stats">
                    <i className="fa fa-check" /> Data information certified
                  </div>
                </CardFooter>
              </Card>
            </Col> */}
          </Row>

          {/* <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Users Behavior</CardTitle>
                  <p className="card-category">24 Hours performance</p>
                </CardHeader>
                <CardBody>
                  <Line
                    data={dashboard24HoursPerformanceChart.data}
                    options={dashboard24HoursPerformanceChart.options}
                    width={400}
                    height={100}
                  />
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="fa fa-history" /> Updated 3 minutes ago
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row> */}

          {/* <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Users Registrations</CardTitle>
                  <p className="card-category">Yearly based performance</p>
                </CardHeader>
                <CardBody>
                  <Bar
                    data={yearState}
                    options={{
                      title:{
                        display:false,
                        // text:'Average Rainfall per month',
                        // fontSize:20
                      },
                      legend:{
                        display:false,
                        // position:'right'
                      }
                    }}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row> */}
          
        </div>
      </>
    );
  }
}

export default Dashboard;
