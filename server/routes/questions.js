const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { GamesAppsModel, validateJoi, QuestionsModel } = require("../models/questionsModel")
const { random } = require("lodash")
const cron = require("node-cron");
const _ = require("lodash");

// // Run the updateRandom() function every day at midnight
// cron.schedule("0 0 * * *", async () => {
//   await updateRandom();
// });

const router = express.Router();

router.get("/all", auth, async (req, res) => {
  try {
    let data = await QuestionsModel.find();
    res.json(data);
  }
  catch (err) {
    console.log("get all Questions", err);
    res.status(500).json(err);
  }
})


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



async function updateRandom(level, cat) {
  const reg = new RegExp(cat, "i");
  const docs = await QuestionsModel.find({ level: level, cat_url: reg });

  for (let doc of docs) {
    doc.random = Math.random();
    await doc.save();
  }

  console.log("Updated", docs.length, "documents");
}

router.get("/", auth, async (req, res) => {
  let level = req.query.level;
  let cat = req.query.cat;
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  let wrongIds = req.query.wrongIds ? req.query.wrongIds.split(",").filter(id => id) : [];
  let limit = req.query.limit; // Set default limit to 10

  let reg = new RegExp(cat, "i");

  try {
    let wrongIdsQuery = { _id: { $in: wrongIds }, cat_url: reg, level };
    let otherQuestionsQuery = { _id: { $nin: wrongIds }, cat_url: reg, level };

    // Fetch questions with wrongIds
    const wrongIdsData = await QuestionsModel
      .find(wrongIdsQuery)
      .sort({ random: 1, cat_url: reverse, level: reverse });

    // Fetch other random questions only if the limit is not reached by wrongIdsData
    const otherQuestionsData = wrongIdsData.length >= limit ? [] : await QuestionsModel
      .find(otherQuestionsQuery)
      .sort({ random: 1, cat_url: reverse, level: reverse })
      .limit(limit - wrongIdsData.length);

    // Merge the two arrays and shuffle them
    const mergedData = _.shuffle([...wrongIdsData, ...otherQuestionsData]);

    // Send the merged data as the response
    res.json(mergedData);
     // Update the random field for all documents with the same level and category in the collection
     await updateRandom(level, cat);

  } catch (err) {
    console.log("get Questions", err);
    res.status(500).json(err);
  }
});


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

  router.post("/favorites", async (req, res) => {
    try {
      let data = await QuestionsModel.find({ _id: { $in: req.body.ids } })
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(502).json({ err })
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