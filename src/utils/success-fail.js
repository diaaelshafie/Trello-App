import { StatusCodes, ReasonPhrases } from "http-status-codes"

export const success2 = (res, variable) => {
    res.status(StatusCodes.OK).json({
        message: "success!",
        variable
    })
}
export const success = (res) => {
    res.status(StatusCodes.OK).json({
        message: "success!"
    })
}
export const fail = (res) => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "fail!",
    })
}
    // const getAllTasks = await taskModel.find()
    // if (getAllTasks) {
    //     let getLateTasks = null
    //     for (let i = 0; i < getAllTasks.length; i++) {
    //         getLateTasks = await taskModel.find().gt(getAllTasks[i].deadLine, todayDate).populate([
    //             {
    //                 path: 'assignedTo',
    //                 select: 'userName email phone'
    //             }
    //         ])
    //     }
    //     if (!getLateTasks) {
    //         return fail(res)
    //     }
    //     success2(res, getLateTasks)
    //     console.log(getLateTasks);
    // }
    // else {
    //     fail(res)
    // }