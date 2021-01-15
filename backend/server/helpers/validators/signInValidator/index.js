import validator from 'express-validator'

const { check, validationResult } = validator

function signInValidator(req, res, next){
    [
    check('email', 'Invalid Email').isEmail(),
    check('password', 'Password is required').notEmpty(),
    ]

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.json({
            errors: errors
        })
    }
    console.log("Successfully validated")
    next();
}

export default signInValidator