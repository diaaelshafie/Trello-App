import multer from 'multer'
import { allowedExtensions } from '../utils/alloweduploadExtension.js'

// multer is also used in the host since it's the module that can read files from the request and deal with them .
export const multerHost = (extensionsArray) => {
    if (!extensionsArray) {
        extensionsArray = allowedExtensions.images
    }
    // we won't need to define anything in the diskStorage but we need it since storage must be sent to multer to be used .
    // cloudinary doesn't need from us to define any of destination or filename in the multer storage method .
    const multerUpload = multer.diskStorage({})
    // const fileFilter = function (req, file, cb) {
    //     if (extensionsArray.includes(file.mimetype)) {
    //         return cb(null, true)
    //     }
    //     return cb(new Error('invalid extensions', { cause: 400 }), false)
    // }
    const fileUpload = multer({
        // fileFilter, 
        storage: multerUpload,
        limits: {
            fields: 3,
            files: 3
        }
    })
    return fileUpload
}