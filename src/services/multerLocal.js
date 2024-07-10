import multer from 'multer'
import { customAlphabet } from 'nanoid'
import fs from 'fs'
import path from 'path'
import { allowedExtensions } from '../utils/alloweduploadExtension.js'

const nanoid = customAlphabet('fhrs123', 5)

// do not use 'async' in this function ?
export const multerLocal = (extensionsArray, customPath) => {
    if (!extensionsArray) {
        extensionsArray = allowedExtensions.images
    }
    if (!customPath) {
        customPath = 'general'
    }
    // const uploadPath = path.resolve(`${process.env.UPLOADS_LOCAL_FILE}/${customPath}`)
    const uploadPath = path.resolve(`uploads/${customPath}`)
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true })
    }
    // define multer storage configs
    const multerUpload = multer.diskStorage({
        // cb will have the  return data .
        // file is the form data that's sent in the request and has some fields or information in it .
        destination: function (req, file, cb) {
            cb(null, `${uploadPath}`)
        },
        filename: function (req, file, cb) {
            console.log(file)
            const customName = nanoid() + file.originalname
            console.log({
                originalName: file.originalname,
                uniqueFileName: customName
            })
            cb(null, customName)
        },
    })
    // define filtering configs
    // note : this function here can be implemented at `fileUpload` in the fileFilter attribute , same for `multerUpload`
    // note : fileFilter parameter needs to return either true or false to interally know if it should upload or not .
    const fileFilter = function (req, file, cb) {
        if (extensionsArray.includes(file.mimetype)) {
            return cb(null, true)
        }
        return cb(new Error('invalid extensions', { cause: 400 }), false)
    }
    const fileUpload = multer({
        fileFilter, storage: multerUpload,
        limits: {
            // fields is the max no of text fields :
            fields: 3,
            // files is the max no of files (has higher authority over : .single or .fields , etc.. )
            files: 3
        }
    })
    return fileUpload
}