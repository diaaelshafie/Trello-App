import { StatusCodes } from "http-status-codes"
export const isDateValid = (deadLine, res) => {
    if (!deadLine) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "dead line is missing!"
        })
        // throw new ERROR ("dead line is missing!")
    }
    const parsedDate = new Date(deadLine)
    if (isNaN(parsedDate)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "invalid date format!"
        })
        // throw new ERROR ("invalid date format!")
    }
    // boss cannot enter a deadline for a task that exceeds today's date :
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0) // this sets the date to that of today's midnight (start of the day)
    if (parsedDate < todayDate) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "invalid date , dates must not exceed today's date!"
        })
        // throw new ERROR ("invalid date , dates must not exceed today's date!")
    }
    console.log(parsedDate < todayDate) // 2023-7-23 < 2023-7-22
    return true
}