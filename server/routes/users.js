const express = require("express");
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth");
const { sendResetPasswordEmail } = require("../helpers/sendEmail");
const { PasswordResetModel } = require("../models/passwordResetModel");
const { validteUser, UserModel, validteLogin, createToken } = require("../models/userModel");
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const path = require("path");
const fs = require('fs');
const { QuestionsModel } = require("../models/questionsModel");
const { log } = require("console");

router.get("/", async (req, res) => {
  res.json({ msg: "Users work" });
})

router.get("/checkToken", auth, async (req, res) => {
  res.json(req.tokenData);
})

router.get("/myInfo", auth, async (req, res) => {
  try {
    let data = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

// Add a favorite question
router.post("/addFavorite", auth, async (req, res) => {
  const { userId, questionId } = req.body;

  // Validate userId and questionId
  if (!userId || !questionId) {
    return res.status(400).json({ error: 'userId and questionId are required.' });
  }

  try {
    const user = await UserModel.findById(userId);
    if (user) {
      // Check if question is already favorited
      if (!user.favorite_ids.includes(questionId)) {
        user.favorite_ids.push(questionId);
        await user.save();
        res.status(200).json({ success: true, message: "Added to favorites" });
      } else {
        res.status(200).json({ success: false, message: "Question already in favorites" });
      }
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error("Error updating user's favorites:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Get a user's favorite questions
router.get("/favorites", auth, async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.tokenData._id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all questions where _id is in user.favorite_ids
    let favoriteQuestions = await QuestionsModel.find({ _id: { $in: user.favorite_ids } });

    res.json(favoriteQuestions);
  }
  catch (err) {
    console.error("Error getting user's favorites:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove a favorite question from a user
router.delete("/removeFavorite", auth, async (req, res) => {
  const { questionId } = req.body;

  // Validate questionId
  if (!questionId) {
    return res.status(400).json({ error: 'questionId is required.' });
  }

  try {
    const user = await UserModel.findById(req.tokenData._id); // Extract user ID from the token
    if (user) {
      const index = user.favorite_ids.indexOf(questionId);

      // Check if question exists in the favorites
      if (index > -1) {
        user.favorite_ids.splice(index, 1);
        await user.save();
        res.status(200).json({ success: true, message: "Removed from favorites" });
      } else {
        res.status(404).json({ success: false, message: "Question not found in favorites" });
      }
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error("Error updating user's favorites:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/updateWrongIds", auth, async (req, res) => {
  const { userId, questionId } = req.body;
  // console.log("Received userId:", userId); // Debug
  // console.log("Received questionId:", questionId); // Debug
  try {
    const user = await UserModel.findById(userId);
    if (user) {
      if (!user.wrong_ids.includes(questionId)) {
        user.wrong_ids.push(questionId);
        await user.save();
        res.status(200).json({ success: true });
      } else {
        res.status(200).json({ success: false, message: "Question already in wrong_ids" });
      }
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.log("Error updating user's wrong_ids:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete('/:userId/wrong_ids/:questionId', auth, async (req, res) => {
  const { userId, questionId } = req.params;
  try {
    const user = await UserModel.findById(userId);
    if (user) {
      user.wrong_ids = user.wrong_ids.filter(id => !id.equals(questionId));
      await user.save();
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.log("Error removing question ID from user's wrong_ids:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




//return the all users
router.get("/allUsers", authAdmin, async (req, res) => {

  let perPage = Number(req.query.perPage) || 20;
  let page = Number(req.query.page) || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try {
    let data = await UserModel
      .find({}, { password: 0 })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  } catch (err) {
    console.error("Error retrieving users:", err);
    res.status(500).json(err);
  }
});


// User registration route
router.post("/signUp", async (req, res) => {
  let validBody = validteUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    if (req.files) {
      let myFile = req.files.myFile;
      if (myFile) {
        if (myFile.size >= 1024 * 1024 * 5) {
          return res.status(400).json({ err: "File too big , max 5MB" });
        }
        let exts_ar = [".jpg", ".png", ".jpeg", ".gif"];
        if (!exts_ar.includes(path.extname(myFile.name))) {
          return res.status(400).json({ err: "File must be an image of jpg, png, jpeg, or gif" });
        }
        const buffer = fs.readFileSync(myFile.tempFilePath);
        // Upload buffer to Cloudinary
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
          // Delete temp file in all cases
          fs.unlink(myFile.tempFilePath, unlinkErr => {
            if (unlinkErr)
              console.error('Error deleting temp file:', unlinkErr);
            else
              console.log('Temp file deleted');
          });
          if (err) {
            console.error('Cloudinary upload error:', err);
            return res.status(500).json({ err: 'Error uploading to Cloudinary' });
          }
          const img_url_cloud = result.secure_url;
          const data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            agreeToPrivacy: req.body.agreeToPrivacy,
            img_url: img_url_cloud
          }
          let user = new UserModel(data);
          user.password = await bcrypt.hash(user.password, 10);
          await user.save();
          user.password = "*****";
          res.status(201).json(user)
        }).end(buffer);
      }
    }
    else {
      const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        agreeToPrivacy: req.body.agreeToPrivacy,
      }
      let user = new UserModel(data);
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      user.password = "*****";
      res.status(201).json(user)
    }
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(401).json({ msg: "Email already in system, try log in", code: 11000 })
    }
    console.error("Error creating user:", err);
    res.status(500).json(err);
  }
});



router.post("/login", async (req, res) => {
  let validBody = validteLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {

    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({ msg: "User or password not match , code:1" })
    }

    let passordValid = await bcrypt.compare(req.body.password, user.password)
    if (!passordValid) {
      return res.status(401).json({ msg: "User or password not match , code:2" })
    }
    let token = createToken(user._id, user.role);
    res.json({ token: token, img: user.img_url });
  }
  catch (err) {
    console.error("Error logging in user:", err);
    res.status(500).json(err);
  }
})

// Route for requesting a password reset
router.post('/requestPasswordReset', async (req, res) => {
  try {
    console.log(req.body);
    const { email, redirectUrl, created, expired } = req.body;
    if (!email || !redirectUrl) {
      return res.status(400).json({ status: "failed", message: "Please provide email and redirectUrl" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: "failed", message: "No account with the supplied email found. Please try again" });
    }
    sendResetPasswordEmail(user, redirectUrl, created, expired, res);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})


router.post('/resetPassword', async (req, res) => {
  const { userId, resetString, newPassword } = req.body;
  let result = await PasswordResetModel.findOne({ userId });
  if (!result) {
    return res.status(401).json({ msg: "Invalid password details or Password reset request not found 1" });
  }
  const { expiresAt } = result;
  //If Expired
  if (expiresAt < Date.now() + 2 * 60 * 60 * 1000) {
    // checking if link expired
    await PasswordResetModel.deleteOne({ userId });
    return res.status(401).json({ err_msg: "Password reset link as expired 2" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  result = await bcrypt.compare(resetString, result.resetString);
  if (!result) {
    return res.status(400).json({ err_msg: "Invalid password details or Password reset request not found 3" });
  }
  const update = await UserModel.updateOne({ _id: userId }, { password: hashedPassword });
  if (update.matchedCount == 0) {
    return res.status(500).json({ err_msg: "Internal Error 4" });
  } else if (update.modifiedCount == 0) {
    return res.status(500).json({ err_msg: "Internal Error 5" });
  }
  await PasswordResetModel.deleteOne({ userId });
  return res.status(200).json({ status: "Success", msg: "Password updated successfully 6" });
})

router.put("/edit/:id", auth, async (req, res) => {
  let validBody = validteUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user_id = req.params.id;

    if (user_id != req.tokenData._id) {
      return res.status(401).json({ msg: "You cannot change another user" })
    }
    let data = await UserModel.findOneAndUpdate({ _id: user_id }, req.body)
    data.password = await bcrypt.hash(data.password, 10);
    await data.save();
    data.password = "*****";
    res.json(data);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json(err);
  }
});


// Change user role
router.patch("/role/", authAdmin, async (req, res) => {
  try {

    let user_id = req.query.user_id;
    let role = req.query.role;
    if (user_id == req.tokenData._id || user_id == "646e5b064f3cff656e6fdfbf") {
      return res.status(401).json({ msg: "You cannot change your own role" })
    }
    let data = await UserModel.updateOne({ _id: user_id }, { role })
    res.json(data);
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json(err);
  }
})

// Delete a user
router.delete("/:idDel", authAdmin, async (req, res) => {
  try {

    let idDel = req.params.idDel;
    // 646e5b064f3cff656e6fdfbf -> id of jaron.111@hotmail.com (super admin)
    if (idDel == req.tokenData._id || idDel == "646e5b064f3cff656e6fdfbf") {
      return res.status(401).json({ msg: "You canot delete yourself, or you cannot delete the admin (yourself)" })
    }
    let data = await UserModel.deleteOne({ _id: idDel });
    res.json(data);
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json(err);
  }
});

module.exports = router;
