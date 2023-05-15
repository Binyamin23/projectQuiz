const express= require("express");
const path = require("path");
const fs = require('fs');
const { auth } = require("../middlewares/auth");
const { CategoryModel } = require("../models/categoryModel");
const { UserModel } = require("../models/userModel");
const router = express.Router();
const {config} = require("../config/secret.js")
const cloudinary = require('cloudinary').v2;

// Set up Cloudinary configuration
cloudinary.config(config.cloudinary);

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

router.get("/", async(req,res) => {
  res.json({msg:"upload work"});
})


router.post("/category/:catID", auth, async (req, res) => {
  try {
    let id = req.params.catID;
    let myFile = req.files.myFile;
    console.log(myFile);
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
      // Convert file to a buffer
      const buffer = fs.readFileSync(myFile.tempFilePath);
      // Upload buffer to Cloudinary
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
        // Delete temp file in all cases
        fs.unlink(myFile.tempFilePath, unlinkErr => {
          if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
          else console.log('Temp file deleted');
        });
        
        if (err) {
          console.error('Cloudinary upload error:', err);
          return res.status(500).json({ err: 'Error uploading to Cloudinary' });
        } 

        // Use result.secure_url to get the image URL
        let data = await CategoryModel.updateOne(
          { _id: id, user_id: req.tokenData._id },
          { img_url: result.secure_url }
        );
        return res.json({ msg: "File uploaded!", status: 200, data });
        
      }).end(buffer);
    }
  } catch (err) {
    console.log(err);
    return res.status(502).json({ err });
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