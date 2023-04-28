const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { GamesAppsModel, validateJoi, QuestionsModel } = require("../models/questionsModel")
const { random } = require("lodash")
const router = express.Router();

router.get("/levelOne/category/:cat", async (req, res) => {
  let cat = req.params.cat;

  let reg = new RegExp(cat, "i");

  try {
    let data = await QuestionsModel.find({ level: 1, cat_url: reg })
    res.json(data);
  }
  catch (err) {
    console.log("levelOne", err)
    res.status(500).json(err)
  }
})



router.get("/", auth, async (req, res) => {
  let level = req.query.level;
  let cat = req.query.cat;
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  let reg = new RegExp(cat, "i");

  let data;

  try {
    if (cat && level) {
      data = await QuestionsModel
        .find({ cat_url: reg, level })
    }
    else if (cat) {
      data = await QuestionsModel
        .find({ cat_url: reg })
        .sort({ level: reverse })
    }
    else {
      data = await QuestionsModel
        .find({})
        .sort({ cat_url: reverse, level: reverse })
    }
    res.json(data);
  }
  catch (err) {
    console.log("get Questions", err)
    res.status(500).json(err)
  }
})

// router.get("/", async (req, res) => {
//   // Math.min -> מביא את המספר הקטן יותר מבין 2 המספרים של ה 20 ומספר העמוד
//   let perPage = Math.min(req.query.perPage,20) || 5;
//   let page = Number(req.query.page) || 1
//   let sort = req.query.sort || "_id";
//   let reverse = req.query.reverse == "yes" ? 1 : -1;
//   let cat = req.query.cat;
//   let userId = req.query.userId;

//   try {
//     let findQuery = {};
//     if(cat){
//       findQuery = {category_url:cat}
//     }
//     else if(userId){
//       // מחזיר רשימת אפליקציות/משחקים של אותו משתמש לפי האיי די שנשלח בקוארי סטרינג
//       findQuery = {user_id:userId}
//     }
//     let data = await GamesAppsModel
//       .find(findQuery)
//       .limit(perPage)
//       .skip((page - 1) * perPage)
//       .sort({ [sort]: reverse })
//     res.json(data);
//   }
//   catch (err) {
//     console.log(err)
//     res.status(500).json(err)
//   }
// })
// יחזיר את מספר הרשומות במערכת
// מה שיחסוף מפיינד רגיל המון משאבים מהמסד נתונים
router.get("/count", authAdmin, async (req, res) => {
  let cat = req.query.cat;
  try {
    let findQuery = {};
    // בשביל צד לקוח שנעשה עמוד קטגוריה שנוכל לדעת לאותה קטגוריה כמה עמודים יש
    if (cat) {
      findQuery = { cat_url: cat }
    }
    let count = await QuestionsModel.countDocuments(findQuery);
    res.json(count)
  }
  catch (err) {
    console.log("count", err);
    res.status(502).json({ err })
  }
})

router.get("/single/:id", async (req, res) => {
  try {
    // SELECT * FROM gameApps WHERE id = '${id}'
    let id = req.params.id;
    let data = await GamesAppsModel.findOne({ _id: id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

// // נוכל לשלוף כמה אפליקציות לפי איי די שנשלח בבאדי
// router.post("/", authAdmin, async(req,res) => {
//   try{
//     // ids -> יכיל מערך של איי דיים של אפליקציות שנרצה לשלוף
//     let data = await QuestionsModel.find({"_id":{$in:req.body.ids}})
//     // let data = await GamesAppsModel.find({"_id":{$in:["63b14e328974ec3b2dcf69b3","63b1509d8974ec3b2dcf69bb","63d65624c24faca5c6721a43"]}})
//     res.json(data);
//   }
//   catch(err){
//     console.log(err);
//     res.status(502).json({err})
//   }
// })

router.post("/newQuestion", authAdmin, async (req, res) => {
  let validBody = validateJoi(req.body);
  if (validBody.error) {
    return res.status(401).json(validBody.error.details)
  }
  try {
    let question = new QuestionsModel(req.body);
    question.user_id = req.tokenData._id;
    question.short_id = await createShortId(); // create short_id
    console.log(question);
    await question.save();
    res.status(201).json(question);
  }
  catch (err) {
    console.log("questions", err);
    res.status(502).json({ err })
  }
})

router.post("/favorites" , async(req,res) => {
  try{
    let data = await QuestionsModel.find({_id:{$in:req.body.ids}})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


router.put("/:id", authAdmin, async (req, res) => {
  let validBody = validateJoi(req.body);
  // אם יש טעות יזהה מאפיין אירור בולידבאדי
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;

    let data = await QuestionsModel.updateOne({ _id: id }, req.body)
    res.json(data);
  }
  catch (err) {
    console.log("putQuestion", err)
    res.status(500).json(err)
  }
})


router.delete("/:id", authAdmin, async (req, res) => {
  try {
    let id = req.params.id;
    let data = await QuestionsModel.deleteOne({ _id: id })
    res.json(data);
  }
  catch (err) {
    console.log("deleteQuestion", err)
    res.status(500).json(err)
  }
})

// async -> פונקציה שעושה רטרן והיא אסינכרונית אוטומטית
// מחזירה פרומיס
const createShortId = async () => {
  try {
    while (true) {
      // מייצר מספר רנדומלי
      let rnd = random(0, 9999);
      // בודק אם הוא כבר קיים באחד מהרשומות
      let quiz = await QuestionsModel.findOne({ short_id: rnd });
      // אם גיים הוא שקר זה אומר שהמספר ייחודי ואותו נחזיר
      if (!quiz) { return rnd }
    }
  }
  catch (err) {
    return err
  }
}

module.exports = router;