import { ReasonPhrases, StatusCodes } from "http-status-codes"

export const wrongCreds = (res) => {
    return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "wrong login credentials!",
        status: ReasonPhrases.UNAUTHORIZED
    })
}