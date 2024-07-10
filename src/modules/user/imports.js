import { userModel } from "../../../database/models/user.model.js";
import bcrypt from 'bcrypt'
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import jwt from 'jsonwebtoken'
import { invalidToken } from "../../utils/invalidTokenRes.js";
import { wrongCreds } from "../../utils/wrongCredsRes.js";
import { success, fail, success2 } from '../../utils/success-fail.js'
import { sendMailServices } from "../../services/sendMailService.js";
import { QRCodeGen } from "../../utils/QRcode.js";
import cloudinary from '../../utils/cloudinaryConfigs.js'

export {
    userModel,
    bcrypt,
    StatusCodes, ReasonPhrases,
    jwt,
    invalidToken,
    wrongCreds,
    success,
    success2,
    fail,
    sendMailServices,
    QRCodeGen,
    cloudinary
}