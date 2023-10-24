import joi from 'joi'
export const generalFields = {
    email: joi.string().email({ minDomainSegments: 2, maxDomainSegments: 5, tlds: { allow: ['com', 'net'] } }).required(),
    password: joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/).required(),
}
