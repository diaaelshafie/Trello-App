import { StatusCodes } from "http-status-codes"
import { userModel } from "../../database/models/user.model.js"

// this middleware will check the authentication of the user being assigned to the task
export const assignedUserAuth = () => {
    return async (req, res, next) => { // also checks the date send 
        const { assignedTo } = req.body // the boss sends this in the body
        const findAssignedUser = await userModel.findById({ _id: assignedTo })
        if (!findAssignedUser) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "the user you want to add a task to is not found !"
            })
        }
        req.assignedUser = findAssignedUser // data of the user that has the task assigned to
        next()
    }
}