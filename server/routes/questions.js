// import necessary libraries and middleware
const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { GamesAppsModel, validateJoi, QuestionsModel } = require("../models/questionsModel")
const { random } = require("lodash")
const _ = require("lodash");

// Initialize router
const router = express.Router();

// Route to get all questions
router.get("/all", authAdmin, async (req, res) => {
  try {
    let query = {};
    if (req.query.cat) query.cat_url = new RegExp(req.query.cat, 'i');
    if (req.query.level) query.level = req.query.level;

    let data = await QuestionsModel.find(query);
    res.json(data);
  }
  catch (err) {
    console.error("Error while fetching all questions:", err.message);
    res.status(500).json({ error: 'Error while fetching all questions', message: err.message });
  }
});

// Get level one questions for a specific category
router.get("/levelOne/category/:cat", async (req, res) => {
  let cat = req.params.cat;
  let reg = new RegExp(cat, "i");

  try {
    let data = await QuestionsModel.find({ level: 1, cat_url: reg });
    res.json(data);
  }
  catch (err) {
    console.error("Error while fetching level one questions:", err.message);
    res.status(500).json({ error: 'Error while fetching level one questions', message: err.message });
  }
});

// Update random field for documents, useful for random question selection
async function updateRandom(level, cat) {
  const reg = new RegExp(cat, "i");
  const docs = await QuestionsModel.find({ level: level, cat_url: reg });

  for (let doc of docs) {
    doc.random = Math.random();
    await doc.save();
  }
}


// Get questions with specific level and category, prioritizing wrong answered questions
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
    console.error("Error while getting questions:", err.message);
    res.status(500).json({ error: 'Error while getting questions', message: err.message });
  }
});

// Route to get count of questions
router.get("/count", authAdmin, async (req, res) => {
  try {
    let findQuery = {};
    if (req.query.cat) {
      findQuery = { cat_url: req.query.cat }
    }
    let count = await QuestionsModel.countDocuments(findQuery);
    res.json(count)
  }
  catch (err) {
    console.error("Error while counting questions:", err.message);
    res.status(500).json({ error: 'Error while counting questions', message: err.message });
  }
});

// Get a single question using its ID
router.get("/single/:id", async (req, res) => {
  try {
    // SELECT * FROM gameApps WHERE id = '${id}'
    let id = req.params.id;
    let data = await GamesAppsModel.findOne({ _id: id });
    res.json(data);
  }
  catch (err) {
    console.error("Error while fetching a single question:", err.message);
    res.status(500).json({ error: 'Error while fetching a single question', message: err.message });
  }
});

// Post route to create a new question
router.post("/newQuestion", authAdmin, async (req, res) => {
  let validBody = validateJoi(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details)
  }
  try {
    let question = new QuestionsModel(req.body);
    question.user_id = req.tokenData._id;
    question.short_id = await createShortId(); // create short_id
    await question.save();
    res.status(201).json(question);
  }
  catch (err) {
    console.error("Error while creating a new question:", err.message);
    res.status(500).json({ error: 'Error while creating a new question', message: err.message });
  }
});

// Put route to update a question
router.put("/:id", authAdmin, async (req, res) => {
  try {
    let validBody = validateJoi(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    let id = req.params.id;
    let data = await QuestionsModel.updateOne({ _id: id }, req.body);
    res.json(data);
  }
  catch (err) {
    console.error("Error while updating a question:", err.message);
    res.status(500).json({ error: 'Error while updating a question', message: err.message });
  }
});

// Delete a question
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    let id = req.params.id;
    let data = await QuestionsModel.deleteOne({ _id: id });
    res.json(data);
  }
  catch (err) {
    console.error("Error while deleting a question:", err.message);
    res.status(500).json({ error: 'Error while deleting a question', message: err.message });
  }
});

const createShortId = async () => {
  try {
    while (true) {
      let rnd = random(0, 9999);
      let quiz = await QuestionsModel.findOne({ short_id: rnd });
      if (!quiz) { return rnd }
    }
  }
  catch (err) {
    return err
  }
}


module.exports = router;
