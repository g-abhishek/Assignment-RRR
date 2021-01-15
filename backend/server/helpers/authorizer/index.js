import expressJwt from 'express-jwt'

export function authorizer(){
    console.log("Checking Authorizer")
    return expressJwt({
        secret: process.env.PRIVATE_JWT_KEY,
        algorithms: ['sha1', 'RS256', 'HS256'],
    })
}

export function isAdmin(req, res, next){
    if(req.user.role !== 0){
        return res.send({
            statusCode: 403,
            message: "Admin Resource !!, Access denied"
        })
    }
    next();
}