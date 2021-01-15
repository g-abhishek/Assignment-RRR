// import validator from 'express-validator'

// const { check, validationResult } = validator

function signupValidator(req, res){
    req.check('name', 'Name is required').notEmpty(),
    req.check('email', 'Invalid Email').isEmail(),
    req.check('contact', 'Mobile Number is required').notEmpty(),
    req.check('password', 'Password is required').notEmpty(),
    req.check('password').isLength({min: 6})
                        .withMessage('Password must contain atleast 6 character')
                        .matches(/\d/)
                        .withMessage('Password must contain number also')
    
    
    const errors = req.validationErrors();
    console.log(errors)
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // if(!errors.isEmpty()){
    //     return res.json({
    //         errors: errors
    //     })
    // }
    console.log("Successfully validated")
    // next();
}

export default signupValidator