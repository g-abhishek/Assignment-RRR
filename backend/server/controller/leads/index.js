import Leads from '../../../database/models/leads/index.js'
import Employee from '../../../database/models/employee/index.js'
import mongoose from 'mongoose'
import async from 'async'


export function newLead(req, res){
    // console.log(req.user)
    // console.log(req.body)
    let emp = JSON.parse(req.body.assignedTo)

    Leads.find({contact: req.body.contact}).then(result => {
        console.log(result)
        if(result.length > 0){
            return res.send({
                statusCode: 400,
                message: "Mobile Already Exists"
            })
        }
        else{
            Leads.create(req.body).then(user => {
                console.log(user)
                
                Employee.findByIdAndUpdate(emp._id, {$push : { leads: user._id }},{ new: true }).then(result => {
                    console.log(result)
                    return res.send({
                        statusCode: 200,
                        message: "Lead registration successfull"
                    })
                }).catch(error => {
                    console.log(error)
                    return res.send({
                        statusCode: 500,
                        message: "Error While updating employee"
                    })
                })     
            }).catch(error => {
                console.log(error)
                return res.send({
                    statusCode: 500,
                    message: "Error While creating lead"
                })
            })

        }
    })

    

}

export function getAllLeads(req, res){
    Leads.find({ leadStatus: "Lead" }).select(" fname lname contact followUpDate email leadStatus ").then(result => {
        return res.send({
            statusCode: 200,
            result: result
        })
    }).catch(error => {
        return res.send({
            statusCode: 500,
            error: error.message
        })
    })
}

export function getPaginatedLeads(req, res){

    if(!req.query.numOfItems || !req.query.pageNum){
        return res.send({
            statusCode: 500,
            message: "please provide numOfItems and pageNum"
        })
    }

    // uanable to fetch documentscount and pagianated data at the ssame time
    // therfore, used async

    async.parallel({
        documentCounts : function(callback){
            Leads.find().countDocuments().exec(callback)
        },
        paginatedData: function(callback){
            Leads.aggregate([
                {
                    $project : { 
                        fname: 1,
                        lname: 1,
                        contact: 1,
                        email: 1,
                        followUpDate: 1,
                        leadStatus: 1,
                    }            
                },
                {
                    $skip : req.query.numOfItems * (req.query.pageNum - 1)
                },
                {
                    $limit : parseInt(req.query.numOfItems)
                }
            ]).exec(callback)
        }
    },function(error, result){
        if(error){
            console.log(error)
            return res.send(error)
        }

        console.log(result)
        return res.send({
            statusCode: 200,
            documentCounts: result.documentCounts,
            paginatedData: result.paginatedData
        })
    })

}

export function deleteLead(req, res){  
    
    Leads.findByIdAndDelete(req.body.id).then(user => {
        if(user === null){
            console.log(user)
            return res.send({
                statusCode: 401,
                message: "User Not Found"
            })
        }
        let emp = JSON.parse(user.assignedTo)
        Employee.findByIdAndUpdate(emp._id, { $pull: { leads: { $in : [mongoose.Types.ObjectId(req.body.id)] }} }, {new: true}).then(result => {
            if(user === null){
                console.log(user)
                return res.send({
                    statusCode: 401,
                    message: "Employee Not Found"
                })
            }

            return res.send({
                statusCode: 200,
                result: result
            })
        }).catch(error => {
            return res.send({
                statusCode: 500,
                message: "Error while deleting lead id from emplyee leads array",
                error: error.message
            })
        })
    }).catch(error => {
        return res.send({
            statusCode: 500,
            message: "Error while deleting lead",
            error: error.message
        })
    })
}