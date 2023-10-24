import joi from 'joi'
import { validateId } from '../../middleware/validation.js'

export const addCategory = joi.object({
    name: joi.string().min(3).max(20).required(),
    token: joi.string().required()
}).required()


export const getCategory = joi.object({
    id: joi.string().custom(validateId).required(),
}).required()

export const updateCategory = joi.object({
    id: joi.string().custom(validateId).required(),
    name: joi.string().min(3).max(20).required(),
    token: joi.string().required()
}).required()

export const deleteCategory = joi.object({
    id: joi.string().custom(validateId).required(),
    token: joi.string().required()
}).required()
