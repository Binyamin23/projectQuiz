const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const { PasswordResetModel } = require('../models/passwordResetModel');
require('dotenv').config();
const bcrypt = require('bcrypt');

/**
 * TODO:(Send email to reset password)
 * 1. Connect to Your Email for Transport
 * 2.Create a function to send email (mailOption)
 * 3.find the user by userId in database Colection ResetPassword
 * 4.create a new String for valid is my Reset Password String
 * 
 * 
 */
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    service: 'gmail',
    secure: true, // use SSL
    auth: {
        user: process.env.AUTH_GMAIL,
        pass: process.env.AUTH_PASS_GMAIL
    }
});


// Layout for send email to reset password
const mailOption = (_id = "", uniqueString = "", _email, _subject, _html) => {
    const mailOptions = {
        from: process.env.AUTH_GMAIL,
        to: _email,
        subject: _subject,
        html: _html
    }

    return mailOptions;
}

exports.sendResetPasswordEmail = async({ _id, email }, redirectUrl, res) => {
    const request = await PasswordResetModel.findOne({ userId: _id });
    if (request) await PasswordResetModel.deleteOne({ userId: _id });
    const resetString = uuidv4() + _id;
    const html = `<p>We heard that you forgot your password.</p>
    <p>Don't worry, use the link below to reset it.</p>
    <p>This link <b>expires in 15min </b></p>
    <p>Press <a href=${redirectUrl +"?id="+_id+"&str="+ resetString}>here</a></p>`;
    const mail = mailOption(_id, resetString, email, "Reset Password", html);
    PasswordResetModel.deleteMany({ userId: _id })
        .then(result => {
            bcrypt.hash(resetString, 10)
                // create new password request
                .then(hashedResetString => {
                    const newPasswordResetModel = new PasswordResetModel({
                        userId: _id,
                        resetString: hashedResetString,
                    })

                    newPasswordResetModel.save()
                        .then(() => {
                            // send the email notification
                            transporter.sendMail(mail, (err, info) => {
                                return res.json({
                                    status: "Pending",
                                    message: "Password reset email sent"
                                })
                            })
                        })
                })
        })
        .catch((error) => {
            console.log(error)
            res.json({
                status: "failed",
                message: "Error while cleaning existing requests",
            });
        })
}