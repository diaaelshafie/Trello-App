import joi from 'joi'
// import bcrypt from 'bcrypt'

export const signUpSchema = {
    body: joi.object({
        userName: joi.string().trim().lowercase(),
        firstName: joi.string().trim(),
        lastName: joi.string().trim(),
        email: joi.string().email({ tlds: { allow: ['com'] } }).required(),
        password: joi.string().required(),
        cPassword: joi.valid(joi.ref('password')).required(),
        gender: joi.string().valid('male', 'female', 'MALE', 'FEMALE', 'not specified').required(),
        phone: joi.string().required(),
        age: joi.number().integer()
    })
}

export const confirmEMailSchema = {
    params: joi.object({
        EmailConfirmToken: joi.string().required()
    })
}

export const logInSchema = {
    // headers: joi.object({
    //     authorization: joi.string().optional()
    // }),
    body: joi.object({
        email: joi.string().email({ tlds: { allow: ['com'] } }).required(),
        password: joi.string().required()
    })
}

export const changePassSchema = {
    // authUser: joi.object({
    //     // how to validate the data type of the object id (_id)
    //     password: joi.string().required()
    // }),
    body: joi.object({
        oldPassword: joi.string().required(),
        newPassword: joi.string().required()
    })
}
// oldPassword: joi.valid(joi.ref('password')),
// oldPassword: joi.string().custom(async (authUser, next) => {
//     const { password } = authUser
//     const passMatch = await bcrypt.compare()
// }),

export const updateUserSchema = {
    // authUser: joi.object({
    //     _id: joi.string().alphanum().length(24)
    // }).options({ presence: 'required' }),
    body: joi.object({
        firstName: joi.string(),
        lastName: joi.string(),
        age: joi.number().integer()
    }).options({ presence: 'required' }).unknown()
}

// export const deleteUserSChema = {
//     authUser: joi.object({
//         _id: joi.string().alphanum().length(24)
//     }).options({ presence: 'required' })
// }

export const logoutSchema = {
    headers: joi.object({
        authorization: joi.string().required()
    }).unknown()
}

export const profilePicSchema = {
    // authUser: joi.object({
    //     _id: joi.string().alphanum().length(24)
    // }).options({ presence: 'required' }),
    file: joi.object({
        profilePic: joi.object()
    })
}

export const coverPicSchema = {
    // authUser: joi.object({
    //     _id: joi.string().alphanum().length(24)
    // }).options({ presence: 'required' }),
    file: joi.object({
        profilePic: joi.object()
    })
}

// schema for deleting a single cover picture
export const deleteCoverPicSchema = {
    body: joi.object({
        public_id: joi.string()
    })
}

export const deleteMultipleCoverPicsSchema = {
    // to validate an array of strings :
    body: joi.object({
        public_id: joi.array().items(joi.string())
    })
}