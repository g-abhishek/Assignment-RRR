import express  from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import expressValidator from 'express-validator'
import adminRouter from './routes/admin/index.js'
import employeeRouter from './routes/employee/index.js'
import leadRouter from './routes/leads/index.js'

const __dirname = path.resolve()
dotenv.config({
    path: path.resolve(__dirname, '.env')
})

console.log(process.env.PRIVATE_JWT_KEY)

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(expressValidator())


app.use(adminRouter)
app.use(employeeRouter)
app.use(leadRouter)

const port = process.env.PORT | 3005

app.get('/', (req, res) => res.send("welcome"))

app.listen(port, () => {
    console.log(`Server is up and running on post - ${port}`)
})