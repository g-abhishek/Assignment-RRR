import Employee from '../../../database/models/employee/index.js'
import async from 'async'

export function newEmployee(req, res){
    console.log(req.user)
    console.log(req.body)

    let newEmploye = new Employee();
    newEmploye.fname = req.body.fname
    newEmploye.lname = req.body.lname
    newEmploye.email = req.body.email
    newEmploye.contact = req.body.contact
    newEmploye.gender = req.body.gender
    newEmploye.street = req.body.street
    newEmploye.city = req.body.city
    newEmploye.pincode = req.body.pincode
    newEmploye.state = req.body.state
    newEmploye.salary = req.body.salary
    newEmploye.status = req.body.status ? req.body.status : false
    newEmploye.setPassword(req.body.password)

    Employee.find({email: req.body.email}).then(result => {
        if(result.length > 0){
            return res.send({
                statusCode: 400,
                message: "Email Already Exists"
            })
        }
        else{

            newEmploye.save().then(result => {
                console.log(result)
                return res.send({
                    statusCode: 200,
                    message: "Employee registration successfull"
                })
            }).catch(error => {
                console.log(error)
                return res.send({
                    statusCode: 400,
                    message: "Employee registration successfull"
                })
            })

        }
    })

    

}

export function getEmployee(req, res){
    Employee.find().select(" fname lname ").then(result => {
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

export function getAllEmployee(req, res){

    Employee.aggregate([
        {
            $project : { 
                fname: 1,
                lname: 1,
                contact: 1,
                email: 1,
                salary: 1,
                status: 1,
                leadsCount: { $size: "$leads" } 
            }            
        }
    ]).then(result => {
        console.log(result)
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

export function getPaginatedEmployee(req, res){

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
            Employee.find().countDocuments().exec(callback)
        },
        paginatedData: function(callback){
            Employee.aggregate([
                {
                    $project : { 
                        fname: 1,
                        lname: 1,
                        contact: 1,
                        email: 1,
                        salary: 1,
                        status: 1,
                        leadsCount: { $size: "$leads" } 
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


export function deleteEmployee(req, res){  
    
    Employee.findByIdAndDelete(req.params.id).then(user => {
        if(user === null){
            console.log(user)
            return res.send({
                statusCode: 401,
                message: "User Not Found"
            })
        }
        return res.send({
            statusCode: 200,
            result: user
        })
    }).catch(error => {
        console.log(error)
        return res.send({
            statusCode: 500,
            message: "Error while deleting Employee",
            error: error.message
        })
    })
}