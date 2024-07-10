import { scheduleJob } from 'node-schedule'

export const cron1 = () => {
    scheduleJob('* * * * * *', function () {
        console.log("cronJob1 runs every second!")
    })
}