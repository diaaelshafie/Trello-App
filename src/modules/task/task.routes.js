import { Router } from 'express'
import { asyncHandler } from '../../utils/async-handler.js'
import { isAuth } from '../../middlewares/auth.js'
import { assignedUserAuth } from '../../middlewares/taskUserAuth.js'
import * as taskCont from './task.controller.js'
import * as taskValidSchemas from './task.validationSchemas.js'
import { validationCoreFunction } from '../../middlewares/validation.js'

const router = Router()

router.post(
    '/addTask',
    isAuth(),
    validationCoreFunction(taskValidSchemas.addTaskSchema),
    assignedUserAuth(),
    asyncHandler(taskCont.addTask)
)

router.put(
    '/updateTask',
    isAuth(),
    validationCoreFunction(taskValidSchemas.updateTaskSchema),
    assignedUserAuth(),
    asyncHandler(taskCont.updateTask)
)

router.delete(
    '/deleteTask',
    isAuth(),
    validationCoreFunction(taskValidSchemas.deleteTaskSchema),
    asyncHandler(taskCont.deleteTask)
)

router.get(
    '/getAllTasksWithUser',
    isAuth(),
    asyncHandler(taskCont.getAllTasksWithUser)
)

router.get(
    '/getUserTasksWithUsers',
    isAuth(),
    validationCoreFunction(taskValidSchemas.getUserTasksWithUsers_schema),
    asyncHandler(taskCont.getUserTasksWithUsers)
)

router.get(
    '/getAllLAteTasks',
    isAuth(),
    asyncHandler(taskCont.getAllLAteTasks)
)

export default router