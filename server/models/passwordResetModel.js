const mongoose = require('mongoose');

const PasswordResetSchema = new mongoose.Schema({
    // Who need change password by id
    userId: String,
    resetString: String,
    createdAt: { type: Date, default: new Date(Date.now() + 2 * 60 * 60 * 1000), },
    expiresAt: { type: Date, default: new Date(Date.now() + 2.25 * 60 * 60 * 1000) }
})

exports.PasswordResetModel = mongoose.model('PasswordReset', PasswordResetSchema);