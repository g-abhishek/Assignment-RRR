import express from 'express'
import signIn from '../../controller/employee/signIn/index.js'
import { deleteEmployee, getAllEmployee, getEmployee, getPaginatedEmployee, newEmployee } from '../../controller/employee/index.js'
import { authorizer, isAdmin } from '../../helpers/authorizer/index.js'
const employeeRouter = express.Router()

employeeRouter.get('/employee/test', (req, res) => {
    console.log("/test employee")
    res.send("/test employee")
})

employeeRouter.post('/employee/login', signIn)
employeeRouter.post('/employee/register', authorizer(), isAdmin, newEmployee) //auhorizer() brackets is liye kyunki next nhi use kiye h usme
employeeRouter.get('/employee/get', authorizer(), getEmployee)
employeeRouter.get('/employee/getallemployee', authorizer(), getAllEmployee)
employeeRouter.get('/employee/paginated/', authorizer(), getPaginatedEmployee)
employeeRouter.delete('/employee/delete/:id', authorizer(), isAdmin, deleteEmployee)

export default employeeRouter