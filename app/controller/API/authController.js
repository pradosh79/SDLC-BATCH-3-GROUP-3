const User = require('../../model/userModel');
const { hashedPassword, comparePassword } = require('../../helper/hashedPassword');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const transporter = require('../../config/emailConfig');

class AuthController {

    // ================= REGISTER =================
    async Register(req, res) {
        try {

            const {
                role,
                firstName,
                lastName,
                email,
                phone,
                password,
                subjectTaught,
                institution,
                yearsOfExperience
            } = req.body;

            if (!firstName || !lastName || !password || (!email && !phone)) {
                return res.status(400).json({ message: "All fields are required" });
            }

            if (email) {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: "User already exists" });
                }
            }

            const hashpassword = await hashedPassword(password);

            const userdata = new User({
                role: role || "student",
                firstName,
                lastName,
                email,
                phone,
                password: hashpassword,

                isStudent: role === "student",
                isTeacher: role === "teacher",

                subjectTaught: role === "teacher" ? subjectTaught : undefined,
                institution: role === "teacher" ? institution : undefined,
                yearsOfExperience: role === "teacher" ? yearsOfExperience : undefined
            });

            const data = await userdata.save();

            return res.status(201).json({
                message: "User registered successfully",
                data: data
            });

        } catch (error) {
            console.log('error', error.message);
            return res.status(500).json({ message: "Internal server error" });
        }
    }


    // ================= LOGIN =================
    async Login(req, res) {
        try {

            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return res.status(400).json({ message: "Email doesn`t exist" });
            }

            const isMatch = await comparePassword(password, existingUser.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({
                _id: existingUser._id,
                role: existingUser.role,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email,
                phone: existingUser.phone,
            }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({
                message: "User logged in successfully",
                token: token,
                user: {
                    role: existingUser.role,
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    email: existingUser.email,
                    phone: existingUser.phone,
                }
            });

        } catch (error) {
            console.log('error', error.message);
            return res.status(500).json({ message: "Internal server error" });
        }
    }


    // ================= DASHBOARD =================
    async Dashboard(req, res) {
        return res.status(200).json({ message: "Welcome to the dashboard", data: req.user });
    }


    // ================= RESET PASSWORD LINK =================
    async resetPasswordLink(req, res) {
        try {
            
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ status: false, message: "Email field is required" });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ status: false, message: "Email doesn't exist" });
            }

            const secret = user._id + process.env.JWT_SECRET_KEY;
            const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '20m' });

            const resetLink = `${process.env.FRONTEND_HOST}/api/reset-password/${user._id}/${token}`;

            await transporter.verify((err, success) => {
                if (err) console.log(err);
                else console.log("Email server ready");
            });
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: user.email,
                subject: "Password Reset Link",
                html: `<p>Hello ${user.firstName},</p>
                       <p>Please <a href="${resetLink}">Click here</a> to reset your password.</p>`
            });

            res.status(200).json({
                status: true,
                message: "Password reset email sent. Please check your email."
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Unable to send password reset email. Please try again later."
            });
        }
    }


    // ================= RESET PASSWORD =================
    async resetPassword(req, res) {
        try {

            const { password, confirm_password } = req.body;
            const { id, token } = req.params;

            const user = await User.findById(id);
            if (!user) {
                return res.status(500).json({ status: false, message: "User not found" });
            }

            const new_secret = user._id + process.env.JWT_SECRET_KEY;
            jwt.verify(token, new_secret);

            if (!password || !confirm_password) {
                return res.status(400).json({
                    status: false,
                    message: "New Password and Confirm New Password are required"
                });
            }

            if (password !== confirm_password) {
                return res.status(400).json({
                    status: false,
                    message: "New Password and Confirm New Password don't match"
                });
            }

            const salt = await bcrypt.genSalt(10);
            const newHashPassword = await bcrypt.hash(password, salt);

            await User.findByIdAndUpdate(user._id, {
                $set: { password: newHashPassword }
            });

            res.status(200).json({
                status: "success",
                message: "Password reset successfully"
            });

        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Unable to reset password. Please try again later."
            });
        }
    }


    // ================= UPDATE PASSWORD =================
    async updatePassword(req, res) {
        try {

            const user_id = req.body.user_id;
            const { password } = req.body;

            if (!password) {
                return res.status(400).json({
                    message: 'Password is required'
                });
            }

            const userdata = await User.findOne({ _id: user_id });

            if (userdata) {

                const newPassword = await hashedPassword(password);

                await User.findOneAndUpdate(
                    { _id: user_id },
                    { $set: { password: newPassword } }
                );

                res.status(200).json({
                    message: 'Password updated successfully'
                });

            } else {
                res.status(400).json({
                    message: 'password not updated'
                });
            }

        } catch (err) {
            res.status(400).json({
                message: err.message
            });
        }
    }

    async VerifyEmail(req, res) {
        try {
            const { email, otp } = req.body;
            // Check if all required fields are provided
            if (!email || !otp) {
                return res.status(400).json({ status: false, message: "All fields are required" });
            }
            const existingUser = await User.findOne({ email });

            // Check if email doesn't exists
            if (!existingUser) {
                return res.status(404).json({ status: "failed", message: "Email doesn't exists" });
            }

            // Check if email is already verified
            if (existingUser.is_verified) {
                return res.status(400).json({ status: false, message: "Email is already verified" });
            }
            // Check if there is a matching email verification OTP
            const emailVerification = await EmailVerifyModel.findOne({ userId: existingUser._id, otp });
            if (!emailVerification) {
                if (!existingUser.is_verified) {
                    // console.log(existingUser);
                    await sendEmailVerivicationOTP(req, existingUser);
                    return res.status(400).json({ status: false, message: "Invalid OTP, new OTP sent to your email" });
                }
                return res.status(400).json({ status: false, message: "Invalid OTP" });
            }
            // Check if OTP is expired
            const currentTime = new Date();
            // 15 * 60 * 1000 calculates the expiration period in milliseconds(15 minutes).
            const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
            if (currentTime > expirationTime) {
                // OTP expired, send new OTP
                await sendEmailVerivicationOTP(req, existingUser);
                return res.status(400).json({ status: "failed", message: "OTP expired, new OTP sent to your email" });
            }
            // OTP is valid and not expired, mark email as verified
            existingUser.is_verified = true;
            await existingUser.save();

            // Delete email verification document
            await EmailVerifyModel.deleteMany({ userId: existingUser._id });
            return res.status(200).json({ status: true, message: "Email verified successfully" });


        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Unable to verify email, please try again later" });
        }


    }


}

module.exports = new AuthController();
