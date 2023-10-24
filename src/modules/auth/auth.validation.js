import joi from 'joi'
import { generalFields } from '../../utils/generalFilds.js'

export const signUp = joi.object({
    name: joi.string().min(3).max(20).required(),
    email: generalFields.email,
    password: generalFields.password,
    cPassword: joi.valid(joi.ref('password')).required(),
}).required()


export const login = joi.object({
    email: generalFields.email,
    password: generalFields.password
}).required()