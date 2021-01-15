import jwt from 'jsonwebtoken'

// import dotenv from 'dotenv'
// import path from 'path'
// const __dirname = path.resolve()
// dotenv.config({
//     path: path.resolve(__dirname, '.env')
// })

const PrivateKey = process.env.PRIVATE_JWT_KEY


export function generateToken(payload){
    console.log(PrivateKey)
    let token = jwt.sign(payload, PrivateKey)
    return token
}