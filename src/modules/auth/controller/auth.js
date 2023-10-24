import jwt from "jsonwebtoken"
import userModel from "../../../../DB/models/user.js"
import bcrypt from 'bcrypt'
//sign up
export const signUp = async (req, res, next) => {
    const { name, email, password } = req.body
    //find if email exist
    const user = await userModel.findOne({ email })
    if (user) return next(new Error("email already exist", { cause: 400 }))
    //save data into database
    const newUser = new userModel({ name, email, password })
    await newUser.save()
    return res.status(201).json({ message: "Done ,please login", status: 201 })
}
//login
export const login = async (req, res, next) => {
    const { email, password } = req.body
    //find email
    const user = await userModel.findOne({ email })
    //check email
    if (!user) {
        return next(new Error("Invalid email or password", { cause: 400 }))
    }
    //check password
    if (bcrypt.compareSync(password, user.password)) {
        //generate token valid 1 hour
        let token = jwt.sign({ email: user.email, _id: user._id }, process.env.AUTHSIGNERURE, { expiresIn: '1h' });
        //generate token valid 1 month
        let refresh_token = jwt.sign({ email: user.email, _id: user._id }, process.env.AUTHSIGNERURE, { expiresIn: 60 * 60 * 24 * 30 });
        return res.status(200).json({ message: "Done", token, refresh_token, status: 200 })
    }
    return next(new Error("Invalid email or password", { cause: 400 }))
}