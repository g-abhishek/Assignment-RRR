import mongoose from '../../connnect.js'
import crypto from 'crypto'
import {v1 as uuid} from 'uuid'

let Schema = mongoose.Schema

const SalaryHistory = new Schema({ 
    salary: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: String, 
        default: new Date()
    },
    paymentType: {
        type: String,
        required: true
    },
    paymentComment: {
        type: String,
        default: "N/A"
    },
},{
    timestamps: true
})

const Employee = new Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    contact: {
        type: Number,
        unique: true,
        required: true
    },
    gender: {
        type: String,
        default: "Male",
        enum: ["Male", "Female", "Other"]
    },
    // address ==============
    street: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true,
        enum: [true, false]
    },
    role: {
        type: Number,
        default: 1
    },
    leads : [],
    salt: {
        type: String,
    },
    hashedPassword: {
        type: String,
    },
    salaryHistory: [SalaryHistory],
},{
    timestamps: true
})

Employee.methods.setPassword = function(password){
    this.salt = uuid()
    this.hashedPassword = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
}

Employee.methods.verifyPassword = function(password){
    let hash = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
    return hash === this.hashedPassword
}

export default mongoose.model('Employee', Employee)