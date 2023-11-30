const joi = require('joi');

// joi valiation schema used to verify req data
const RegisterSchema = joi.object().keys({
    email: joi.string().required().email(),
    userName: joi.string().required(),
    firstName:joi.string().required(),
    lastName:joi.string().required(),
    password:joi.string().required()
})

const LoginSchema = joi.object().keys({
    email: joi.string().required().email(),
    password: joi.string().required()
})
const updateSchema = joi.object().keys({
    name: joi.string(),
    userName: joi.string(),
    email: joi.string().email(),
    password: joi.string()
})
const ForgotPasswordSchema = joi.object().keys({
    email: joi.string().required().email()
})
const ResetPasswordSchema = joi.object().keys({
    email: joi.string().required().email(),
    resetCode: joi.string().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required()
})
module.exports = {
    RegisterSchema,
    LoginSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema,
    updateSchema
}