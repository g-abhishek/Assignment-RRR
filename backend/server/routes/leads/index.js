import express from 'express'
import { newLead, getAllLeads, deleteLead, getPaginatedLeads } from '../../controller/leads/index.js'
import { authorizer, isAdmin } from '../../helpers/authorizer/index.js'
const leadRouter = express.Router()


leadRouter.post('/lead/register', authorizer(), isAdmin, newLead) //auhorizer() brackets is liye kyunki next nhi use kiye h usme
leadRouter.get('/lead/getallleads', authorizer(), isAdmin, getAllLeads)
leadRouter.put('/lead/delete/', authorizer(), isAdmin, deleteLead)
leadRouter.get('/lead/paginated/', authorizer(), getPaginatedLeads)


export default leadRouter