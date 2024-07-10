import joi from 'joi'

export const addTaskSchema = {
    authUser: joi.object({
        _id: joi.object().required()
    }).unknown(),
    body: joi.object({
        title: joi.string(),
        description: joi.string(),
        status: joi.string().valid('toDo', 'doing', 'done').required(),
        assignedTo: joi.string().alphanum().length(24).required(),
        deadLine: joi.date()
    })
}

export const updateTaskSchema = {
    authUser: joi.object({
        _id: joi.object().required()
    }).unknown(),
    body: joi.object({
        title: joi.string(),
        description: joi.string(),
        status: joi.string().valid('toDo', 'doing', 'done').required(),
        assignedTo: joi.string().alphanum().length(24).required(),
        taskID: joi.string().alphanum().length(24).required()
    })
}

export const deleteTaskSchema = {
    authUser: joi.object({
        _id: joi.object().required()
    }).unknown(),
    body: joi.object({
        taskID: joi.string().alphanum().length(24).required()
    })
}

export const getUserTasksWithUsers_schema = {
    authUser: joi.object({
        _id: joi.object().required()
    }).unknown(),
}