import Employee from '../../../../database/models/employee/index.js'
import { generateToken } from '../../../helpers/tokenHandler/index.js'


export default function signIn(req, res){
    console.log(req.body)

    Employee.findOne({email: req.body.email}).then(user => {
        if(user === null){
            return res.send({ 
                statusCode: 404,
                message : "User not found."
            }); 
        }else{
            console.log(user)
            if(user.verifyPassword(req.body.password)){
                let token = generateToken({
                    email: user.email,
                    role: user.role
                })
                return res.send({
                    statusCode: 200,
                    message: 'User Varified',
                    token: token,
                    user: {
                        id: user._id,
                        name: `${user.fname} ${user.lname}`,
                        email: user.email,
                        role: user.role
                    }
                })
            }else{
                return res.send({ 
                    statusCode: 404,
                    message : "Wrong Password"
                }); 
            }
        }
    }).catch(err => {
        console.log(err)
        return res.send({
            statusCode: 400,
            error: err
        })
    })

}