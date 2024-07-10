import { StatusCodes } from "http-status-codes"
import { invalidToken } from "../utils/invalidTokenRes.js"
import { userModel } from "../../database/models/user.model.js"
import jwt from 'jsonwebtoken'

export const isAuth = () => {
    return async (req, res, next) => {
        const { authorization } = req.headers
        if (!authorization) { // if there is no token
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "no token"
            })
        }
        if (authorization.split(' ')[0] != process.env.USER_TOKEN_LOGIN_PREFIX) {
            return invalidToken(res)
        }
        const verifyToken = await jwt.verify(authorization.split(' ')[1], process.env.USER_logIN_TOKEN_SECRET_KEY)
        if (!verifyToken || !verifyToken._id) {
            return invalidToken(res)
        }
        const findUser = await userModel.findById({ _id: verifyToken._id })
        if (!findUser) {
            return next(new Error("couldn't find the user in data base!", { cause: 400 }))
        }
        if (!findUser?.isOnline) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "you are offline , please login !"
            })
        }
        if (findUser?.deleted) {
            return next(new Error('the user is soft deleted!', { cause: StatusCodes.BAD_REQUEST }))
        }
        // findUser has the user document form the data base
        else {
            req.authUser = findUser // added field "authUser" in the request object.
            next()
        }
    }
}