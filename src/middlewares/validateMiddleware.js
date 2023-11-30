const validate = (schema) => {
    return async (req, res, next) => {
        const { error } = await schema.validate(req.body, {
            abortEarly: false,  //collect all errors
            allowUnknown: true  //allow additional fields in req.body
        });
        const valid = error == null
        if (valid) {
            // if vlidation passes, proceed to the next middleware or route handler
            next()
        } else {
            // if validation fails, send the error details as a response
            const { details } = error
            const errorDetails = details.map((err) => {
                return {
                    message: err.message,
                    path: err.path[0],
                }
            })
            res.status(422).json({ error: errorDetails });
        }
    }
}
module.exports = validate;