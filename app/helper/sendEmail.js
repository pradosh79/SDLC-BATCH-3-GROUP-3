
const transporter = require('../config/emailConfig');
const EmailOtpModel = require('../model/otpModel');


const sendEmailVerivicationOTP = async (req, user) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log('otp',otp);
    

   const data=await new EmailOtpModel({
        userId: user._id,
        otp: otp,

    }).save();
    console.log('otp data',data);
    
    await transporter.sendMail({
        from: process.env.EMAIL_FROM ||'amarlibrary@gmail.com',
        to: user.email,
        subject: "Email Verification OTP",
        text: `Your OTP is ${otp}. It is valid for 15 minutes.`,
        html: `<b>Your OTP is ${otp}. It is valid for 15 minutes.</b>`
    })

    return otp;
}


module.exports = sendEmailVerivicationOTP;