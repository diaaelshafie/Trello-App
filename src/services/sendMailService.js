import nodemailer from 'nodemailer'

export async function sendMailServices({
    message, to, subject
} = {}) {
    const transporter = await nodemailer.createTransport({
        host: "localhost",
        port: 587,
        secure: false,
        auth: {
            user: 'diaaabdelazizelshafie4491@gmail.com',
            pass: 'upqchshznjegfsoj'
        },
        tls: {
            rejectUnauthorized: true
        },
        service: 'gmail'
    })
    const sendEmail = await transporter.sendMail({
        to: to ? to : '',
        from: '"trello app" <diaaabdelazizelshafie4491@gmail.com>',
        subject: subject ? subject : 'none',
        html: message ? message : 'none'
    }) // if `sendEmail` succeeded , it should have a length in the accepted field 
    console.log('message', sendEmail);
    if (sendEmail.accepted.length) {
        return true
    }
    return false
}