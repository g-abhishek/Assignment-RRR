import express from 'express'
import signupValidator from '../../helpers/validators/signUpValidator/index.js'
import signInValidator from '../../helpers/validators/signInValidator/index.js'
import signUp from '../../controller/admin/signUp/index.js'
import signIn from '../../controller/admin/signIn/index.js'
const adminRouter = express.Router()

adminRouter.get('/test', (req, res) => {
    console.log("/test success")
    res.send("/test success")
})

adminRouter.post('/admin/register',  signUp)
adminRouter.post('/admin/login',  signIn)

export default adminRouter