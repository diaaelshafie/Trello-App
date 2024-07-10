import { StatusCodes } from 'http-status-codes'

export const validationCoreFunction = (schema) => {
    const reqMethods = ['body', 'query', 'params', 'headers', 'file', 'files', 'authUser']
    return async (req, res, next) => {
        const validationErrors = []
        for (const key of reqMethods) {
            if (schema[key]) { // schema has joi methods in it
                const validation = await schema[key].validate(req[key], { abortEarly: false })
                if (validation.error) {
                    validationErrors.push(validation.error.details)
                }
            }
        }
        if (validationErrors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "validation error",
                Errors: validationErrors
            })
        }
        next()
    }
}