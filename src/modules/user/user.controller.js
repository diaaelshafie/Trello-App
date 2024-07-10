import * as modules from './imports.js'
const {
    userModel, bcrypt, StatusCodes, ReasonPhrases, jwt,
    invalidToken, wrongCreds, success, success2,
    fail, sendMailServices, QRCodeGen, cloudinary
} = modules

// signUp :
export const signUp = async (req, res, next) => {
    const { userName, email, password, age, gender, phone, firstName, lastName } = req.body
    const EmailConfirmToken = jwt.sign({ email }, process.env.USER_EMAIL_CONFIRM_TOKEN_SECRET_KEY, { expiresIn: '1h' })
    const confirmLink = `${req.protocol}://${req.headers.host}:${process.env.PORT}/user/confirmEmail/${EmailConfirmToken}` // this is to send a parameter in the query params
    const message = `<a href=${confirmLink}> please enter the link below to confirm your email</a>` // the message to show the user with
    const sendMessage = await sendMailServices({
        message,
        to: email,
        subject: 'Email confirmation'
    })
    if (!sendMessage) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "please try again or contact the support team"
        })
    }
    const hashedPassWord = await bcrypt.hash(password, +process.env.SALT_ROUNDS) // the hashSync does not necessarily need 'await'.
    const newUser = new userModel({
        userName, email, password: hashedPassWord,
        age, gender, phone,
        firstName, lastName
    })
    await newUser.save()
    if (newUser) {
        success2(res, newUser)
    }
    else {
        fail(res)
    }
}

// confirm email : parralellism promise.all()
export const confirmEmail = async (req, res, next) => {
    // since the token is sent in the query params :
    const { EmailConfirmToken } = req.params
    const decodedToken = jwt.verify(EmailConfirmToken, process.env.USER_EMAIL_CONFIRM_TOKEN_SECRET_KEY)
    if (decodedToken) {
        const updateUser = await userModel.findOneAndUpdate({ email: decodedToken.email }, { isConfirmed: true }, { new: true })
        return res.status(StatusCodes.OK).json({
            message: "confirmation is successfull , you can now login!",
            userData: updateUser
        })
    }
    fail(res)
}

// logIn (with token)
export const logIn = async (req, res, next) => {
    const { authorization } = req.headers // in case that the user is logged in already and wants to login again
    const { email, password } = req.body
    if (authorization) { // bad request or not acceptable since the user already made a login before 
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "user already logged in!"
        })
    }
    const findUser = await userModel.findOne({ email, isConfirmed: true }) // find one is used since it returns an object not an array like find()
    if (!findUser.isConfirmed) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "please confirm your email first!"
        })
    }
    if (findUser) { // if the user is authenticated on the system (has a match in the data base)
        const hashedPassword = await bcrypt.compare(password, findUser.password)
        if (hashedPassword) {
            const newToken = await jwt.sign({
                _id: findUser._id,
                email: findUser.email
            }, process.env.USER_logIN_TOKEN_SECRET_KEY, { expiresIn: '1d' })
            const makeOnline = await userModel.findOneAndUpdate({ email }, { isOnline: true }, { new: true })
            if (!makeOnline) {
                return next(new Error('could not make the user online!', { cause: 500 }))
            }
            res.status(StatusCodes.OK).json({
                message: "done",
                status: ReasonPhrases.OK,
                token: newToken,
                userData: findUser
            })
        }
        else {
            wrongCreds(res)
        }
    }
    else {
        wrongCreds(res)
    }
}

// changePassword (with token) :
export const changePassWord = async (req, res, next) => {
    const { password, _id } = req.authUser // password from the database document
    const { newPassword, oldPassword } = req.body // oldPassword is the password the user enetered in the interface (front end)
    const passMatch = await bcrypt.compare(oldPassword, password)
    if (passMatch) { // put the new password in the database .
        // check if the new password matches an existing one first : 
        // const checkNewPass = await bcrypt.compare(newPassword)
        const hashedNewPass = await bcrypt.hash(newPassword, +process.env.SALT_ROUNDS)
        const incVersion = req.authUser.__v++
        const updatedUser = await userModel.findOneAndUpdate({ _id }, { password: hashedNewPass, __v: incVersion }, { new: true })
        if (updatedUser) {
            success(res)
        }
        else {
            fail(res)
        }
    }
    else {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: "passwords doesn't match!"
        })
    }
}

// update user : (age , firstName , lastName)
export const updateUser = async (req, res, next) => {
    const { _id } = req.authUser
    const { age, firstName, lastName } = req.body
    const updateUser = await userModel.findByIdAndUpdate({ _id }, {
        firstName, lastName, age
    }, { new: true })
    if (updateUser) { // if the user is found (and so updated)
        success2(res, updateUser)
    }
    else {
        fail(res)
    }
}

// delete user : (must be logged in) :
export const deleteUser = async (req, res, next) => {
    // users can only delete themselves , so we only need the _id from the token
    const { _id } = req.authUser
    const deleteUser = await userModel.findByIdAndDelete({ _id })
    if (deleteUser) {
        success2(res, deleteUser)
    }
    else {
        fail(res)
    }
}

// soft delete : (must be loggged in) :
// logic error : user can make actions after being soft deleted
export const softDeleteUser = async (req, res, next) => {
    const { _id } = req.authUser
    const findUser = await userModel.findById({ _id })
    if (findUser) {
        findUser.deleted = true // to soft delete a user
        // or : findUser.$isDeleted(true)
        await findUser.save()
        success(res)
    }
    else {
        fail(res)
    }
}

// logout :
export const logOut = async (req, res, next) => {
    const { authorization } = req.headers
    if (authorization.split(" ")[0] != process.env.USER_TOKEN_LOGIN_PREFIX) {
        return invalidToken(res)
    }
    const verifyToken = await jwt.verify(authorization.split(" ")[1], process.env.USER_logIN_TOKEN_SECRET_KEY)
    if (verifyToken) {
        success2(res, authorization.split(" ")[1])
    }
    else {
        fail(res)
    }
}

// add profile picture locally
export const addPoriflePicture = async (req, res, next) => {
    // a profile picture is a single picture .
    // fieldname : profilePic
    const { _id } = req.authUser
    // const { profilePic } = req.file
    if (!req.file) {
        return next(new Error('there is no picture sent!', { cause: StatusCodes.BAD_REQUEST }))
    }
    // profilePic holds the object of the file (picture)
    // we need the path from it to store it in the data base .
    const saveProfPic = await userModel.findByIdAndUpdate(_id, {
        // we save the path that the image should be saved at .
        profilePicture: req.file.path
    }, { new: true })
    if (!saveProfPic) {
        return next(new Error('failed to save profile Pic', { cause: StatusCodes.INTERNAL_SERVER_ERROR }))
    }
    success2(res, saveProfPic)
}

// add cover picture locally
export const addCoverPic = async (req, res, next) => {
    // we need to save the cover pic (s) without overriding or deleting the previous ones
    // fields name = 'coverPic'
    const { _id } = req.authUser
    // const { coverPic } = req.file
    if (!req.files) {
        return next(new Error('no cover pictures were found!', { cause: StatusCodes.BAD_REQUEST }))
    }
    const coverPicsPaths = []
    // since req.files is an array now .
    for (const file of req.files) {
        coverPicsPaths.push(file.path)
    }
    const user = await userModel.findById(_id)

    // if there are previous cover pictures -> spread them in the 'coverPicsPaths' array , if not -> keep the array as it self
    user.coverPictures.length ? coverPicsPaths.push(...user.coverPictures) : coverPicsPaths

    const saveCoverPic = await userModel.findByIdAndUpdate(_id, {
        coverPictures: coverPicsPaths
    }, { new: true })
    if (!saveCoverPic) {
        return next(new Error('failed to save cover picture!', { cause: StatusCodes.INTERNAL_SERVER_ERROR }))
    }
    success2(res, saveCoverPic)
}

// QR getting user data with QR code :
export const GetUserQr = async (req, res, next) => {
    const { _id, email, userName } = req.authUser
    const userQRcode = await QRCodeGen({
        data: { _id, email, userName }
    })
    if (!userQRcode) {
        return next(new Error('failed to generate QR code!', { cause: 500 }))
    }
    success2(res, userQRcode)
}

export const addCloudPoriflePicture = async (req, res, next) => {
    const { _id } = req.authUser
    if (!req.file) {
        return next(new Error('there is no picture sent!', { cause: StatusCodes.BAD_REQUEST }))
    }
    // to use cloudinary to upload data to the host , use method 'upload' in the 'uploader' module inside cloudinary.v2:
    // upload takes 2 parameters : the path to the file you want to upload , an object that specifies the uploading directories , etc...
    const data = await cloudinary.uploader.upload(req.file.path, {
        folder: `Users/ProfilePictures/${req.authUser._id}`,
        // more options that we can use :
        // public_id: `${_id}`, // this is to make a custom generetion of public_id (not recommended since it may override files unless you need it)

        // if we want to use the file's originale name to generate the public_id of the asset (file) :
        use_filename: true, // it generates a string to make sure that the public_id is unique , to disable it , use :
        unique_filename: false,

        // this limits the type of the file , needed to be determined since each type has a size limit to upload with :
        // resource_type: 'video'
        resource_type: 'image'
    })
    const { secure_url, public_id } = data
    // secure_url , public_id are the one we will store in the data base :
    const saveProfPic = await userModel.findByIdAndUpdate(_id, {
        profilePicture: { secure_url, public_id }
    }, { new: true })
    if (saveProfPic == null) {
        // in case the user uploaded only one file :
        await cloudinary.uploader.destroy(public_id)
        // if we want to delete a bulk of files : 
        // await cloudinary.api.delete_resources([array of public_ids])
        return next(new Error('failed to save profile Pic', { cause: StatusCodes.INTERNAL_SERVER_ERROR }))
    }
    success2(res, data)
}

export const addCloudCoverPictures = async (req, res, next) => {
    const { _id } = req.authUser
    if (!req.files) {
        return next(new Error('no cover pictures were found!', { cause: StatusCodes.BAD_REQUEST }))
    }
    // cloudinary can't take an array and upload it at once , we need to check every element in the for loop and also await for it
    const coverPicsPaths = []
    // this for loop being nested or not depends on the postman or thunderClient usage 
    for (const file of req.files) {
        const data = await cloudinary.uploader.upload(file.path, {
            folder: `Users/coverPictures/${_id}`,
            resource_type: 'image'
        })
        const { secure_url, public_id } = data
        coverPicsPaths.push({ secure_url, public_id })
    }
    console.log()
    const user = await userModel.findById(_id)

    // if there are previous cover pictures -> spread them in the 'coverPicsPaths' array , if not -> keep the array as it self
    user.coverPictures.length ? coverPicsPaths.push(...user.coverPictures) : coverPicsPaths

    const saveCoverPic = await userModel.findByIdAndUpdate(_id, {
        coverPictures: coverPicsPaths
    }, { new: true })
    console.log(saveCoverPic)
    if (!saveCoverPic) {
        return next(new Error('failed to save cover picture!', { cause: StatusCodes.INTERNAL_SERVER_ERROR }))
    }
    success2(res, saveCoverPic)
}

export const deleteProfilePicture = async (req, res, next) => {
    // there is only 1 profile pic
    const { _id } = req.authUser
    // to delete a certain field (update the document techincally) in a doc , use $unset in findAndUpdate methods :
    const getUser = await userModel.findByIdAndUpdate(_id, { $unset: { profilePicture: 1 } }, { new: false })
    const { public_id } = getUser.profilePicture
    if (!getUser) {
        return next(new Error("couldn't find the user", { cause: StatusCodes.BAD_REQUEST }))
    }
    if (!public_id) {
        return next(new Error("the user doesn't have a profile picture!"))
    }
    const deletedPic = await cloudinary.uploader.destroy(public_id)
    if (!deletedPic) {
        return next(new Error("couldn't delete the picture from host", { cause: 500 }))
    }
    res.json({
        message: "deleting is successfull !",
        deletedPicture: deletedPic
    })
}

export const deleteCoverPicture = async (req, res, next) => {
    // since auth.js brought the user doc from the data base already , we can scrape
    const { _id, coverPictures } = req.authUser
    // to delete a certain picture we have to get it's public_id from the body (we won't make the user put a whole file in the request to delete it) :
    const { public_id } = req.body
    // to make the same logic of .includes() to an array of object , we can do :
    const checkPublicId = await coverPictures.some(key => key.public_id === public_id)
    if (!checkPublicId) {
        return next(new Error("there is no such cover picture!", { cause: 400 }))
    }
    // let flag = false
    // for (key of coverPictures) {
    //     if (key.public_id === public_id) {
    //         flag = true
    //     }
    // }
    // to remove (execlude) a certain element of an array in a document and leave the document itself , use :
    const updateUser = await userModel.updateOne({ _id }, { $pull: { coverPictures: { public_id } } })
    if (!updateUser) {
        return next(new Error("failed to update the data base!", { cause: 500 }))
    }
    const deletedCoverPic = await cloudinary.uploader.destroy(public_id)
    if (!deletedCoverPic) {
        return next(new Error("couldn't delete the picture from the host", { cause: 500 }))
    }
    res.json({
        message: "deleting done!",
        deletedCoverPic,
        deletedUser: getUser
    })
}

export const deleteMultipleCoverPictures = async (req, res, next) => {
    const { _id, coverPictures } = req.authUser
    if (!coverPictures.length) {
        return next(new Error("there are no cover photos to delete !", { cause: 400 }))
    }
    // public_id field in the request body is an array of strings (public_ids of photos)
    const { public_id } = req.body
    const photosIDs = []
    let flag = true
    for (let string in public_id) {
        if (coverPictures.some(key => key.public_id === public_id[string])) {
            photosIDs.push(public_id[string])
        }
        else {
            flag = false
        }
    }
    // for (let string = 0; string < public_id.length; string++) {
    //     if (coverPictures.some(key => key.public_id === public_id[string])) {
    //         photosIDs.push(public_id[string])
    //     }
    //     else {
    //         flag = false
    //     }
    // }
    if (flag === false) {
        return next(new Error("there are photos that aren't in the user document!", { cause: 400 }))
    }
    const updateDB = await userModel.updateOne({ _id }, {
        $pull: { coverPictures: { public_id: { $in: photosIDs } } }
    })
    if (!updateDB) {
        return next(new Error("failed to update data base!", { cause: 500 }))
    }
    const deletedPhotos = await cloudinary.api.delete_resources(photosIDs)
    if (!deletedPhotos) {
        return next(new Error("couldn't delete all photos!", { cause: 500 }))
    }
    res.json({
        message: "deleting succedded!",
        updatedUser: updateDB,
        deletedPhotos,
        photosDeleted: photosIDs
    })
}

export const test = async (req, res, next) => {
    res.json({
        message: "done",
        file: req.file
    })
}