const joi = require('joi')

// joi validation schema used to verify req data
const createSchema = joi.object().keys({
    user_id: joi.string().required(),
    schoolName: joi.string().required(),
    department: joi.string().required(),
    fee: joi.string().required(),
    faculty: joi.string().required(),
    country: joi.string().required(),
    email: joi.string().required(),
    website: joi.string().uri().required(),
    contact: joi.string().required(),
    course_overview: joi.string().required(),
    about_school: joi.string().required(),
    funding: joi.string().required(),
    requirement: joi.string().required(),
    services: joi.string().required()
});

module.exports = { createSchema };