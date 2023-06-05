const express = require("express");
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth");
const { sendResetPasswordEmail } = require("../helpers/sendEmail");
const { PasswordResetModel } = require("../models/passwordResetModel");
const { validteUser, UserModel, validteLogin, createToken } = require("../models/userModel");
const router = express.Router();

// מאזין לכניסה לראוט של העמוד בית לפי מה שנקבע לראוטר
// בקובץ הקונפיג
router.get("/", async (req, res) => {
  res.json({ msg: "Users work" });
})

router.get("/checkToken", auth, async (req, res) => {
  res.json(req.tokenData);
})

// auth - פונקציית מידל וואר שבודקת שיש טוקן תקין למשתמש
// ואז הפונקציה הבאה בשרשור של הראוטר שולפת את המידע של המשתמש
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



router.post("/updateScoresByCat", auth, async (req, res) => {
  const { userId, cat, right, wrong } = req.body;
  console.log(req.body);

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the score for the given category or create a new one
    let score = user.scores_array_byCat.find(score => score.cat_url === cat);

    if (!score) {
      score = {
        cat_url: cat,
        right_answers: right,
        wrong_answers: wrong
      };
      user.scores_array_byCat.push(score);
      user.markModified("scores_array_byCat");
      await user.save();
    } else {
      const updatedScore = {
        cat_url: cat,
        right_answers: score.right_answers + right,
        wrong_answers: score.wrong_answers + wrong
      };

      await UserModel.findOneAndUpdate(
        { _id: userId, "scores_array_byCat.cat_url": cat },
        { $set: { "scores_array_byCat.$": updatedScore } }
      );
    }

    res.json({ message: "User scores updated successfully" });
  } catch (error) {
    console.log("Error updating user scores:", error);
    res.status(500).json({ message: "Error updating user scores", error });
  }
});






router.post('/updateAnswerCount', auth, async (req, res) => {
  const { userId, isCorrect } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (user) {
      if (isCorrect) {
        user.right_answers++;
      } else {
        user.wrong_answers++;
      }
      await user.save();
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.log('Error updating user\'s answer count:', err);
    res.status(500).json({ success: false, message: 'Server error' });
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




// ראוט שמחזיר את כל המשתמשים ורק משתמש עם טוקן אדמין
// יוכל להגיע לכאן
router.get("/allUsers", authAdmin, async (req, res) => {

  let perPage = Number(req.query.perPage) || 20;
  let page = Number(req.query.page) || 1
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try {
    let data = await UserModel
      .find({}, { password: 0 })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

// הרשמה של משתמש חדש
router.post("/signUp", async (req, res) => {
  let validBody = validteUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    user.password = "*****";
    res.status(201).json(user)
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(401).json({ msg: "Email already in system, try log in", code: 11000 })
    }
    console.log(err);
    res.status(500).json(err);
  }
})

// לוג אין משתמש קיים שבסופו מקבל טוקן 
router.post("/login", async (req, res) => {
  let validBody = validteLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    // לבדוק אם מייל קייים בכלל במערכת
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({ msg: "User or password not match , code:1" })
    }
    // שהסיסמא שהגיעה מהבאדי בצד לוקח תואמת לסיסמא המוצפנת במסד
    let passordValid = await bcrypt.compare(req.body.password, user.password)
    if (!passordValid) {
      return res.status(401).json({ msg: "User or password not match , code:2" })
    }
    let token = createToken(user._id, user.role);
    res.json({ token: token })
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

router.post('/requestPasswordReset', async(req, res) => {
  try {
      const { email, redirectUrl , created , expired } = req.body;
      if (!email || !redirectUrl) {
          return res.status(400).json({ status: "failed", message: "Please provide email and redirectUrl" });
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
          return res.status(401).json({ status: "failed", message: "No account with the supplied email found. Please try again" });
      }
      sendResetPasswordEmail(user, redirectUrl,created,expired,res);
  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
})


router.post('/resetPassword', async(req, res) => {
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
  result =await bcrypt.compare(resetString, result.resetString);
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
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

// ?user_id= &role=
// משנה תפקיד של משתמש
router.patch("/role/", authAdmin, async (req, res) => {
  try {
    // ישנה את הרול של המשתמש שבקווארי של היוזר איי די
    // לערך שנמצא בקווארי של רול
    let user_id = req.query.user_id;
    let role = req.query.role;
    // לא מאפשר למשתמש עצמו לשנות את התפקיד שלו
    // או לשנות את הסופר אדמין
    if (user_id == req.tokenData._id || user_id == "646e5b064f3cff656e6fdfbf") {
      return res.status(401).json({ msg: "You cannot change your own role" })
    }
    let data = await UserModel.updateOne({ _id: user_id }, { role })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

router.delete("/:idDel", authAdmin, async (req, res) => {
  try {

    let idDel = req.params.idDel;
    // בודק שהאיי די שנרצה למחוק לא האיי די של המשתמש
    // המחובר או של הסופר אדמין
    // 646e5b064f3cff656e6fdfbf -> id of jaron.111@hotmail.com (super admin)
    if (idDel == req.tokenData._id || idDel == "646e5b064f3cff656e6fdfbf") {
      return res.status(401).json({ msg: "You canot delete yourself, or you cannot delete the admin (yourself)" })
    }
    let data = await UserModel.deleteOne({ _id: idDel });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

module.exports = router;