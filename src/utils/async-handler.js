export const asyncHandler = (API) => {
    return (req, res, next) => {
        API(req, res, next)
            .catch((err) => {
                return res.status(500).json({
                    message: "fail",
                    error: err.message
                });
                // console.log(err);
            })
    }
}