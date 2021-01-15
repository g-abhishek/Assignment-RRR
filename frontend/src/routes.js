import LeadRegistration from './views/Leads/LeadRegistration.js'
import Dashboard from './views/Dashboard.js'
import EmployeeRegistration from './views/Employee/EmployeeRegistration.js'
import LeadsTable from './views/Leads/LeadsTable.js'
import EmployeeTable from './views/Employee/EmployeeTable.js'

export var routes = [

  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/emp/registration",
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
    path: "/employee",
    name: "Employee",
    icon: "nc-icon nc-bank",
    component: EmployeeTable,
    layout: "/admin",
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
    path: "/emp/registration",
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
    path: "/employee",
    name: "Employee",
    icon: "nc-icon nc-bank",
    component: EmployeeTable,
    layout: "/admin",
  },
]