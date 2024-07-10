import { Router } from "express"
import { asyncHandler } from '../../utils/async-handler.js'
import * as userCont from './user.controller.js'
import { isAuth } from "../../middlewares/auth.js"
import { isValid } from "../../middlewares/signUpValidation.js"
import * as uservalidationSchemas from './user.validationSchema.js'
import { validationCoreFunction } from "../../middlewares/validation.js"
import { multerLocal } from "../../services/multerLocal.js"
import { allowedExtensions } from "../../utils/alloweduploadExtension.js"
import { multerHost } from "../../services/multerHost.js"

const router = Router()

router.post(
    '/signUp',
    isValid(),
    validationCoreFunction(uservalidationSchemas.signUpSchema),
    asyncHandler(userCont.signUp)
)

router.get(
    '/confirmEmail/:EmailConfirmToken',
    validationCoreFunction(uservalidationSchemas.confirmEMailSchema),
    asyncHandler(userCont.confirmEmail)
)

router.get(
    '/logIn',
    validationCoreFunction(uservalidationSchemas.logInSchema),
    asyncHandler(userCont.logIn)
)

router.patch(
    '/changePassWord',
    isAuth(),
    validationCoreFunction(uservalidationSchemas.changePassSchema),
    asyncHandler(userCont.changePassWord)
)

router.put(
    '/updateUser',
    isAuth(),
    validationCoreFunction(uservalidationSchemas.updateUserSchema),
    asyncHandler(userCont.updateUser)
)

router.delete(
    '/deleteUser',
    isAuth(),
    // validationCoreFunction(uservalidationSchemas.deleteUserSChema),
    asyncHandler(userCont.deleteUser)
)

router.put(
    '/softDeleteUser',
    isAuth(),
    // validationCoreFunction(uservalidationSchemas.deleteUserSChema),
    asyncHandler(userCont.softDeleteUser)
)

router.get(
    '/logOut',
    validationCoreFunction(uservalidationSchemas.logoutSchema),
    asyncHandler(userCont.logOut)
)

router.post(
    '/addProfilePic',
    isAuth(),
    validationCoreFunction(uservalidationSchemas.profilePicSchema),
    multerLocal(
        allowedExtensions.images
        , 'User/profile').single('profilePic'),
    asyncHandler(userCont.addPoriflePicture)
)

router.post(
    '/addCoverPics',
    isAuth(),
    validationCoreFunction(uservalidationSchemas.coverPicSchema),
    multerLocal(
        allowedExtensions.images
        , 'User/cover').array('coverPics'),
    asyncHandler(userCont.addCoverPic)
)

router.post(
    '/addCloudPoriflePicture',
    isAuth(),
    validationCoreFunction(uservalidationSchemas.profilePicSchema),
    multerHost(
        ...allowedExtensions.images,
        ...allowedExtensions.videos
    ).single('profilePic'),
    asyncHandler(userCont.addCloudPoriflePicture)
)

router.post(
    '/addCloudCoverPictures',
    isAuth(),
    validationCoreFunction(uservalidationSchemas.coverPicSchema),
    multerHost(
        ...allowedExtensions.images,
        ...allowedExtensions.videos
    ).array('coverPics'),
    asyncHandler(userCont.addCloudCoverPictures)
)

router.delete(
    '/deleteProfilePicture',
    isAuth(),
    asyncHandler(userCont.deleteProfilePicture)
)

router.delete(
    '/deleteCoverPicture',
    isAuth(),
    validationCoreFunction(uservalidationSchemas.deleteCoverPicSchema),
    asyncHandler(userCont.deleteCoverPicture)
)

router.delete(
    '/deleteMultipleCoverPictures',
    isAuth(),
    validationCoreFunction(uservalidationSchemas.deleteMultipleCoverPicsSchema),
    asyncHandler(userCont.deleteMultipleCoverPictures)
)

router.post(
    '/testMulter',
    multerLocal().single('profile'),
    asyncHandler(userCont.test)
)

router.get(
    '/getUserWithQR',
    isAuth(),
    asyncHandler(userCont.GetUserQr)
)

export default router