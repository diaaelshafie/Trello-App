import mongoose from 'mongoose'
export const DBconnection = () => {
    return mongoose.connect(process.env.DB_CONNECTION_LINK)
        .then((res) => console.log("DB connected successfully"))
        .catch((err) => console.log("DB connection failed"))
}