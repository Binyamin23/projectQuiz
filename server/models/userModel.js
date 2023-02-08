const mongoose = require("mongoose"); //connect to mongoose module
const Joi = require("joi"); //connect to joi module
const jwt = require("jsonwebtoken"); //connect to jsonwebtoken module


//create a Schema, Need same properties like dataBase
let userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    address: String,
    phone: String,
    profileImg: String,
    role: {
        type: String,
        default: "user"
    },
    // The default of this date will be the date we created the list
    date_created: {
        type: Date,
        default: Date.now() //using date functions
    },
    todos_id: [{ type: mongoose.Types.ObjectId, ref: 'todos' }]

})


//create a model by using shecma ^ (mongoose.model("collection name", Schema))
exports.UserModel = mongoose.model("users", userSchema);


//Create Token of the user
exports.genToken = ({ _id, role }) => { //the function get UserID
    let token = jwt.sign({ _id, role }, `${process.env.TOKEN_SECRET}`, { expiresIn: "600mins" }); //Token properties
    //(jwt.sign({ ID of User }, `SecretWord`, { expiresIn: "Time to expired" }))
    return token; // return the token created
}
//validation create user
exports.validateUser = (_reqBody) => { //validation of create a user with request from the body
    let joiSchema = Joi.object({ // Create a joi object
        fullName: Joi.string().min(2).max(100).required(), //required (Must send in request)
        // email - Checking the integrity of the enamel
        email: Joi.string().min(2).max(150).email().required(),
        password: Joi.string().min(3).max(100).required(),
        // allow - Allows you to send an empty property
        address: Joi.string().min(2).max(150).allow(null, ""), //allow (Must not send)
        phone: Joi.string().min(2).max(20).allow(null, ""),
        profileImg: Joi.string().min(2).max(9999).allow(null, "")

    })
    return joiSchema.validate(_reqBody); // return the validation (joi object) with request from the body 
}

//validation login user
exports.validateLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(150).email().required(),
        password: Joi.string().min(3).max(100).required(),
    })
    return joiSchema.validate(_reqBody);
}