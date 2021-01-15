import Admin from '../../../../database/models/admin/index.js'


export default function signUp(req, res){
    console.log(req.body)

    let newAdmin = new Admin();
    
    newAdmin.name = req.body.name
    newAdmin.email = req.body.email
    newAdmin.contact = req.body.contact
    newAdmin.setPassword(req.body.password)


    newAdmin.save().then(result => {
        console.log(result)
        return res.send(result)
    }).catch(error => {
        console.log(error)
        return res.send(error)
    })
}