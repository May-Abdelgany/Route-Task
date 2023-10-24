
import { Types } from 'mongoose';
export const validateId = (value, helper) => {
    Types.ObjectId.isValid(value) ? true : helper.message("In-valid ID");
};
export const validation = (schema) => {
    return (req, res, next) => {
        let inputData = { ...req.body, ...req.params, ...req.query }
        if (req.headers.token) {
            inputData.token = req.headers.token
        }
        const result = schema.validate(inputData, { abortEarly: false })
        if (result.error) {
            return res.json({ message: 'validation error', error: result.error.details })
        }
        next()
    }
}