import express from 'express'
import { getCallData2, newLead, getAllLeads, deleteLead, getPaginatedLeads, converToClient, getPaginatedClients, addCall, getCallData, getLeadById, changeCallStatus, getCallHistory } from '../../controller/leads/index.js'
import { authorizer, isAdmin } from '../../helpers/authorizer/index.js'
const leadRouter = express.Router()


leadRouter.post('/lead/register', authorizer(), isAdmin, newLead) //auhorizer() brackets is liye kyunki next nhi use kiye h usme
leadRouter.get('/lead/getallleads', authorizer(), isAdmin, getAllLeads)
leadRouter.put('/lead/delete/', authorizer(), isAdmin, deleteLead)
leadRouter.get('/lead/paginated/', authorizer(), getPaginatedLeads)
leadRouter.put('/lead/convert/client/', authorizer(), converToClient)
leadRouter.put('/lead/change/call/status/', authorizer(), changeCallStatus)

leadRouter.get('/client/paginated/', authorizer(), getPaginatedClients)
leadRouter.put('/lead/addcall/:id', authorizer(), addCall)
leadRouter.get('/lead/calldata/:id', authorizer(), getCallData)
leadRouter.get('/lead/calldataa/:id', authorizer(), getCallData2)
leadRouter.get('/lead/:id', authorizer(), getLeadById)

export default leadRouter