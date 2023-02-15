const express= require("express");
const { authAdmin } = require("../middlewares/auth");
let {CategoryModel,validateJoi} = require("../models/categoryModel");
const router = express.Router();

router.get("/all", async(req,res) => {
  try{
    let data = await CategoryModel.find({})
    .limit(20);
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

// יודע לשלוף רק אחד ... ישמש אותנו לעריכה לקבלת מידע עליו
router.get("/single/:id", async(req,res) => {
  try{
    let id = req.params.id;
    let data = await CategoryModel.findOne({_id:id});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

//שולף קטגוריה לפי השם שלה
router.get("/byCode/:url_code", async(req,res) => {
  try{
    let url_code = req.params.url_code;
    let data = await CategoryModel.findOne({url_code});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

// get שנותן לי מידע על קטגוריה ספציפית

router.post("/newCat", authAdmin, async(req,res) => {
  let validBody = validateJoi(req.body);
  if(validBody.error){
    return res.status(401).json(validBody.error.details)
  }
  try{
    let category = new CategoryModel(req.body);
    await category.save();
    res.status(201).json(category);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.put("/edit/:id", authAdmin,async(req,res) => {
  let validBody = validateJoi(req.body);
  if(validBody.error){
    return res.status(401).json(validBody.error.details)
  }
  try{
    let id = req.params.id;
    let data = await CategoryModel.updateOne({_id:id},req.body);
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.delete("/delete/:id", authAdmin,async(req,res) => {
  try{
    let id = req.params.id;
    let data = await CategoryModel.deleteOne({_id:id});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


module.exports = router;