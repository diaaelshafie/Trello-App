import { StatusCodes } from "http-status-codes"
import { userModel } from "../../database/models/user.model.js"
import bcrypt from 'bcrypt'

export const isValid = () => {
    return async (req, res, next) => {
        const { email, password, cPassword, phone } = req.body
        const { authorization } = req.headers
        if (authorization) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "account already exists"
            })
        }
        if (password !== cPassword) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "passwords do not match!"
            })
        }
        const findUser = await userModel.findOne().or([{ email }, { password }, { phone }])
        // if findUser.email didn't exist it will throw error since email is null , but if we used ? (optional chaining) it will return undefined without throwing an error
        if (findUser?.email == email) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "email already exists!"
            })
        }
        if (findUser?.password) {
            // the following condition will crash the server if there is no password to compare .
            if (await bcrypt.compare(password, findUser?.password)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "password already exists!"
                })
            }
        }
        if (findUser?.phone == phone) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "phone already exists!"
            })
        }
        next()
    }
}