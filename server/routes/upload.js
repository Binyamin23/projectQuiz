const express= require("express");
const path = require("path");
const { auth } = require("../middlewares/auth");
const { CategoryModel } = require("../models/categoryModel");
const { UserModel } = require("../models/userModel");
const router = express.Router();

router.get("/", async(req,res) => {
  res.json({msg:"upload work"});
})



router.post("/category/:catID", auth, async (req, res) => {
  try {
    // TODO: לעשות בדיקה מלכתחילה שהאיידי של המשחק שרוצים לעלות שייך למשתמש
    // ישמש לשם הקובץ
    let id = req.params.catID;
    let myFile = req.files.myFile;
    if (myFile) {
      if (myFile.size >= 1024 * 1024 * 5) {
        return res.status(400).json({ err: "File too big , max 5MB" });
      }
      let exts_ar = [".jpg", ".png", ".jpeg", ".gif"];
      if (!exts_ar.includes(path.extname(myFile.name))) {
        return res
          .status(400)
          .json({ err: "File must be an image of jpg or png" });
      }
      // מייצר שם חדש לקובץ שהוא האיי די פלוס הסיומת של קובץ המקור שהעלנו
      let newFileName = id + path.extname(myFile.name);
      myFile.mv("server/public/images/categories/"+newFileName, async(err) => {
        if(err){
          console.log(err);
          res.status(400).json({err})
        } else {
          console.log("File uploaded successfully");
          // TODO: update the doc in collection of the new img url
          let data = await CategoryModel.updateOne({_id:id,user_id:req.tokenData._id},{img_url:"/public/images/categories/"+newFileName})
          res.json({msg:"File uploaded!",status:200,data})
        }
      });
      
    }
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});


router.post("/users",auth, async(req,res) => {
  try{
    console.log(req.files.myFile)
    let myFile = req.files.myFile;
    if(myFile){
      if(myFile.size >= 1024*1024*5){
        return res.status(400).json({err:"File too big , max 5MB"})
      }
      let exts_ar = [".jpg",".png",".jpeg"];
      if(!exts_ar.includes(path.extname(myFile.name))){
        return res.status(400).json({err:"File must be an image of jpg or png"})
      }
      let fileName = req.tokenData._id + path.extname(myFile.name);
      // myFile.mv -> מקבל 2 פרמטרים לאן לעלות את הקובץ
      // וקול בק שיש בו אירור במידה ויש בעיה
      myFile.mv("server/public/user_images/"+fileName, async(err) => {
        if(err){res.status(400).json({err})}
        // מעדכן במסד נתונים על הקובץ
        let data = await UserModel.updateOne({_id:req.tokenData._id},{img_url:"/user_images/"+fileName})
        res.json({msg:"File upload",...data})
      } )
    }
    
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
  
})

module.exports = router;