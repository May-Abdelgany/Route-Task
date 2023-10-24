import joi from 'joi'
import { validateId } from '../../middleware/validation.js'


const task = joi.object({
    taskBody: joi.string().min(3).max(20).required(),
    categoryId: joi.string().custom(validateId).required(),
    privacy: joi.string().valid('public', 'private').optional()
}).required();

const taskArray = joi.array().items(task).required();


export const addTask = joi.object({
    task: joi.alternatives().try(
        task,
        taskArray
    ).required(),
    token: joi.string().required()
}).required()

export const getTask = joi.object({
    id: joi.string().custom(validateId).required(),
    token: joi.string().optional()
}).required()


export const updateTask = joi.object({
    id: joi.string().custom(validateId).required(),
    taskBody: joi.string().min(3).max(20).required(),
    token: joi.string().optional(),
    privacy: joi.string().valid('public', 'private').optional()
}).required();

export const deleteTask = joi.object({
    id: joi.string().custom(validateId).required(),
    token: joi.string().required()
}).required()

export const getTaskByCategory = joi.object({
    id: joi.string().custom(validateId).required(),
    token: joi.string().optional(),
    page: joi.string().optional(),
    size: joi.string().optional(),
    sort: joi.string().optional(),
    privacy: joi.string().optional(),
}).required()