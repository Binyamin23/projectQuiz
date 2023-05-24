const mongoose = require('mongoose');

const PasswordResetSchema = new mongoose.Schema({
    // Who need change password by id
    userId: String,
    resetString: String,
    createdAt: Date,
    expiresAt: Date
})

exports.PasswordResetModel = mongoose.model('PasswordReset', PasswordResetSchema);