
import userModel from "../../DB/models/user.js";
import { asyncHandler } from "../utils/errorHandling.js";
import jwt from 'jsonwebtoken'
export const auth = (type) => {
    return asyncHandler(async (req, res, next) => {
        const { token } = req.headers
        if (type != 'must') {
            if (token) {
                const user = await checkAuth(token)
                req.user = {
                    _id: user._id,
                    email: user.email
                }
                return next()
            }
            return next()
        }
        const user = await checkAuth(token)
        req.user = {
            _id: user._id,
            email: user.email
        }
        return next()
    })
}


const checkAuth = asyncHandler(async (token) => {
    if (!token.startsWith(process.env.BEARERKEY)) {
        return next(new Error("invalid Bearer key", { cause: 500 }))
    }
    const splitToken = token.split(process.env.BEARERKEY)[1]
    if (!splitToken) {
        return next(new Error("invalid token", { cause: 500 }))
    }
    const decode = jwt.verify(splitToken, process.env.AUTHSIGNERURE)
    if (!decode._id) {
        return next(new Error("invalid signutarue", { cause: 500 }))
    }
    const user = await userModel.findById(decode._id)
    return user
})
