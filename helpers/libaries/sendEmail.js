const nodemailer = require('nodemailer');

const sendEmail = async(mailOptions) =>{
    let transport = nodemailer.createTransport({
        service: 'Gmail',
        host : process.env.SMPT_HOST,
        port : process.env.SMPT_PORT,
        auth :{
            user : process.env.SMPT_USER,
            pass : process.env.SMPT_PASS
        }
    });
    let info = await transport.sendMail(mailOptions);
    console.log(`Message sent : ${info.messageId}`);
}

module.exports = sendEmail;