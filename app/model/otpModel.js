
const mongoose = require('mongoose');


const emailOtpSchema = new mongoose.Schema({

    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    otp:{type:String,required:true},
    createdAt:{type:Date,default:Date.now,expires:'15m'}

})

const EmailOtpModel = mongoose.model('otp',emailOtpSchema);
module.exports = EmailOtpModel;