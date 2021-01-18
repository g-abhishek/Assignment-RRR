import LeadRegistration from './views/adminViews/Leads/LeadRegistration.js'
import Dashboard from './views/Dashboard.js'
import DashboardEmployee from './views/DashboardEmployee.js'
import EmployeeRegistration from './views/adminViews/Employee/EmployeeRegistration.js'
import LeadsTable from './views/adminViews/Leads/LeadsTable.js'
import EmployeeTable from './views/adminViews/Employee/EmployeeTable.js'
import ClientTable from './views/adminViews/Leads/ClientTable.js'


import LeadsTableEmp from './views/employeeViews/Leads/LeadsTable.js'
import ClientTableEmp from './views/employeeViews/Leads/ClientTable.js'
import Profile from './views/employeeViews/Leads/Profile.js'
import EmployeeProfile from './views/adminViews/Employee/EmployeeProfile.js'

export var routes = [

  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/registration/employee",
    name: "Create Employee",
    icon: "nc-icon nc-bank",
    component: EmployeeRegistration,
    layout: "/admin",
  },
  {
    path: "/lead/registration",
    name: "New Lead",
    icon: "nc-icon nc-bank",
    component: LeadRegistration,
    layout: "/admin",
  },
  {
    path: "/leads",
    name: "Leads",
    icon: "nc-icon nc-bank",
    component: LeadsTable,
    layout: "/admin",
  },
  {
    path: "/leads/:id",
    name: "Leads",
    icon: "nc-icon nc-bank",
    component: Profile,
    layout: "/admin",
  },
  {
    path: "/clients",
    name: "Clients",
    icon: "nc-icon nc-bank",
    component: ClientTable,
    layout: "/admin",
  },
  {
    path: "/clients/:id",
    name: "Clients",
    icon: "nc-icon nc-bank",
    component: Profile,
    layout: "/admin",
  },
  {
    path: "/employee",
    name: "Employee",
    icon: "nc-icon nc-bank",
    component: EmployeeTable,
    layout: "/admin",
  },
  {
    path: "/employee/:id",
    name: "Employee",
    icon: "nc-icon nc-bank",
    component: EmployeeProfile,
    layout: "/admin",
  },




  // Employee Routes ========================================================
  
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: DashboardEmployee,
    layout: "/employee",
  },
  {
    path: "/leads",
    name: "Leads",
    icon: "nc-icon nc-bank",
    component: LeadsTableEmp,
    layout: "/employee",
  },
  {
    path: "/leads/:id",
    name: "Lead Profile",
    icon: "nc-icon nc-bank",
    component: Profile,
    layout: "/employee",
  },
  {
    path: "/clients",
    name: "Clients",
    icon: "nc-icon nc-bank",
    component: ClientTableEmp,
    layout: "/employee",
  },
  {
    path: "/clients/:id",
    name: "Client Profile",
    icon: "nc-icon nc-bank",
    component: Profile,
    layout: "/employee",
  },

]

export var sidebarRoutes = [
  
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/registration/employee",
    name: "Create Employee",
    icon: "nc-icon nc-bank",
    component: EmployeeRegistration,
    layout: "/admin",
  },
  {
    path: "/lead/registration",
    name: "New Lead",
    icon: "nc-icon nc-bank",
    component: LeadRegistration,
    layout: "/admin",
  },  
  {
    path: "/leads",
    name: "Leads",
    icon: "nc-icon nc-bank",
    component: LeadsTable,
    layout: "/admin",
  },
  {
    path: "/clients",
    name: "Clients",
    icon: "nc-icon nc-bank",
    component: ClientTable,
    layout: "/admin",
  },
  {
    path: "/employee",
    name: "Employee",
    icon: "nc-icon nc-bank",
    component: EmployeeTable,
    layout: "/admin",
  },
]

export var employeeSidebarRoutes = [
  
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: DashboardEmployee,
    layout: "/employee",
  },
  {
    path: "/leads",
    name: "Leads",
    icon: "nc-icon nc-bank",
    component: DashboardEmployee,
    layout: "/employee",
  },
  {
    path: "/clients",
    name: "Clients",
    icon: "nc-icon nc-bank",
    component: DashboardEmployee,
    layout: "/employee",
  },
  
 
]