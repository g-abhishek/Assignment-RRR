import mongoose from '../../connnect.js'

let Schema = mongoose.Schema

const CallHistory = new Schema({
    nextCallDate : {
        type: String,
        required: true
    },
    callStatus: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Done"]
    },
    description: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Done"]
    },
},{
    timestamps: true
})

const Leads = new Schema({
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
    },
    contact: {
        type: Number,
        required: true,
        index: true,
        unique: true
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
    addressOf: {
        type: String,
        default: "House",
        enum: ["House", "Shop"]
    },
    leadSource: {
        type: String,
        required: true
    },
    leadType: {
        type: String,
        default: "New",
        enum: ["New", "Old"]
    },
    leadStatus: {
        type: String,
        default: "Lead",
        enum: ["Lead", "Client"]
    },
    assignedTo: {
        type: String,
        required: true
    },
    representative: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    followUpDate: {
        type: String,
        required: true
    },
    callHistory : [ CallHistory ]
},{
    timestamps: true
})


export default mongoose.model('Leads', Leads)