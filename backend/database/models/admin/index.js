import mongoose from '../../connnect.js'
import crypto from 'crypto'
import {v1 as uuid} from 'uuid'

let schema = mongoose.Schema

const Admin = new schema({
    name: {
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
    salt: {
        type: String,
    },
    hashedPassword: {
        type: String,
    },
    role: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
})

Admin.methods.setPassword = function(password){
    this.salt = uuid()
    this.hashedPassword = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
}

Admin.methods.verifyPassword = function(password){
    let hash = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
    return hash === this.hashedPassword
}

export default mongoose.model('Admin', Admin)