import { validationResult } from "express-validator"

const validatorSchema = (req, res, next) => {
    try {
        validationResult(req).throw()
        return next()
    } catch (err) {
        return res.status(400).send(err.mapped())
    }    
}

export default validatorSchema