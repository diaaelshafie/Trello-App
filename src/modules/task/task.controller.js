import * as imports from './imports.js'
const {
    taskModel, userModel, jwt, bcrypt, success, success2,
    fail, invalidToken, wrongCreds, ReasonPhrases, StatusCodes, isDateValid
} = imports

// 1-add task with status (toDo) (user must be logged in) => user must have a token (authorization)
export const addTask = async (req, res, next) => { // [] test 
    const { _id } = req.authUser
    const { status, assignedTo, title, description, deadLine } = req.body
    if (status != 'toDo') { // since the boss will only assign a anew task , so it's status is always 'toDo'
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "invalid task status!"
        })
    }
    const parsedDate = isDateValid(deadLine, res)
    console.log(parsedDate);
    if (!parsedDate === true) {
        return parsedDate
    }
    // if (parsedDate.res) { return }
    const addTask = new taskModel({
        title, description,
        status, userID: _id,
        assignedTo, deadLine: new Date(deadLine)
    })
    await addTask.save()
    if (addTask) {
        success2(res, addTask)
    }
    else {
        fail(res)
    }
}

// 2-update task (title , description , status) and assign task to other user(user must be logged in) (creator only can update task)
export const updateTask = async (req, res, next) => {
    // authentication of both the task creator and the task reciever is done in middlewares
    const { _id } = req.authUser
    const { title, description, status, assignedTo, taskID } = req.body
    // taskID is the task document ObjectId 
    // assignedTo is the new assigned user
    const checkCreator = await taskModel.findOne().and([ // finds the task in the data base and checks the creator 
        { _id: taskID }, { userID: _id }
    ])
    if (!checkCreator?._id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "task doesn't exist"
        })
    }
    if (!checkCreator?.userID) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "you are not the task creator"
        })
    }
    // we need to check the user assigned the task 
    if (status != 'toDo' && status != 'done' && status != 'doing') {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "invalid status!"
        })
    }
    // status validation should be an util also 
    const updateTask = await taskModel.findByIdAndUpdate(taskID, {
        title,
        description,
        status,
        assignedTo
    }, { new: true })
    if (!updateTask) {
        return fail(res)
    }
    success2(res, updateTask)
}

// 3-delete task(user must be logged in) (creator only can delete task)
export const deleteTask = async (req, res, next) => {
    // creator validation is only needed here => done in middleware
    // we need to validate the task document 
    const { taskID } = req.body
    const userID = req.authUser._id
    // we cannot use findByIdAndDelete since we will use a condition that invloves other fields than _id
    const findTask = await taskModel.findOneAndDelete().and([
        { _id: taskID }, { userID }
    ])
    if (!findTask) {
        console.log(findTask)
        return fail(res)
    }
    success2(res, findTask)
}

//4-get all tasks with user data
export const getAllTasksWithUser = async (req, res, next) => {
    const getAllTasks = await taskModel.find().populate([
        {
            path: "assignedTo",
            select: "userName email phone"
        }
    ])
    if (!getAllTasks) {
        return fail(res)
    }
    success2(res, getAllTasks)
}

// 5-get tasks of oneUser (boss) with user (assigned User) data (user (boss) must be logged in)
export const getUserTasksWithUsers = async (req, res, next) => {
    // user auth is in middleware 
    const { _id } = req.authUser
    const getTasks = await taskModel.find({ userID: _id }).populate([
        {
            path: 'assignedTo',
            select: 'userName email phone'
        }
    ])
    if (!getTasks) {
        return fail(res) // fail => means that there are no tasks found
    }
    success2(res, getTasks)
}

// 6-get all tasks that not done after deadline => those tasks are not of a certain assigned User
export const getAllLAteTasks = async (req, res, next) => {
    // user auth is in middleware 
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0) // today's date (00:00)
    const getAllTasks = await taskModel.find()
    if (getAllTasks) {
        let getLateTasks = null
        for (let i = 0; i < getAllTasks.length; i++) {
            // it makes the following and logic auto : where deadLine === getAllTasks[i].deadLine && deadLine lessThan todayDate
            getLateTasks = await taskModel.find().where('deadLine').equals(`${getAllTasks[i].deadLine}`).lt(todayDate).populate([
                {
                    path: 'assignedTo',
                    select: 'userName email phone'
                }
            ])
        }
        if (!getLateTasks) {
            return fail(res)
        }
        success2(res, getLateTasks)
        console.log(getLateTasks);
    }
    else {
        fail(res)
    }

}