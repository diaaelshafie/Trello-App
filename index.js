import express from 'express'
import { config } from 'dotenv'
import { DBconnection } from './database/connection.js'
import { userRouter, taskRouter } from './src/modules/index.router.js'
import { StatusCodes } from 'http-status-codes'
import { cron1 } from './src/utils/Crons.js'
config()
const server = express()
const port = +process.env.PORT

server.use(express.json())
DBconnection()
// files are stored like this in the data base : \uploads\\User\\profile\\31hhswallpaperflare.com_wallpaper (9).jpg
// which if we want to access from the host , it won't be a valid URL since actually there is no such thing
// to access the uploads with the routers from the local host (uploads is a static folder and not a router) , we do :
server.use('/uploads', express.static('./uploads'))
server.use('/user', userRouter)
server.use('/task', taskRouter)
server.use('*',
    (req, res, next) => res.status(StatusCodes.NOT_FOUND).json({
        message: "404 , not found , invalid url!"
    })
)

server.use((err, req, res, next) => {
    if (err) {
        return res.status(err['cause'] || 500).json({
            message: err.message
        })
    }
})

// cron1()

server.listen(port, () => {
    console.log("server is running!")
})