import { StatusCodes, ReasonPhrases } from "http-status-codes"

export const invalidToken = (res) => {
    return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "invalid token",
        status: ReasonPhrases.UNAUTHORIZED
    })
}