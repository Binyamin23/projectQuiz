const express = require("express");
const { authAdmin, auth } = require("../middlewares/auth");
let { CategoryModel, validateJoi } = require("../models/categoryModel");
const router = express.Router();
const { config } = require("../config/secret.js")
const cloudinary = require('cloudinary').v2;
const path = require("path");
const fs = require('fs');


// Set up Cloudinary configuration
cloudinary.config(config.cloudinary);

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

router.get("/all", async (req, res) => {
  try {
    let data = await CategoryModel.find({})
      .limit(20);
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

// יודע לשלוף רק אחד ... ישמש אותנו לעריכה לקבלת מידע עליו
router.get("/single/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let data = await CategoryModel.findOne({ _id: id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

//שולף קטגוריה לפי השם שלה
router.get("/byCode/:url_code", async (req, res) => {
  try {
    let url_code = req.params.url_code;
    let data = await CategoryModel.findOne({ url_code });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.post("/newCat", authAdmin, async (req, res) => {
  try {
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
          if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
          else console.log('Temp file deleted');
        });

        if (err) {
          console.error('Cloudinary upload error:', err);
          return res.status(500).json({ err: 'Error uploading to Cloudinary' });
        }

        let data = {
          name: req.body.name,
          url_code: req.body.url_code,
          info: req.body.info,
          user_id: req.tokenData._id,
          img_url: result.secure_url
        };

        // Create a new category with the provided data
        let newCategory = new CategoryModel(data);
        await newCategory.save();
        return res.json({ msg: "Category created!", status: 200, newCategory });

      }).end(buffer);
    } else {
      return res.status(400).json({ err: "No file provided" });
    }
  } catch (err) {
    console.log(err);
    return res.status(502).json({ err: "An unexpected error occurred" });
  }
});


router.put("/edit/:id", authAdmin, async (req, res) => {
  let validBody = validateJoi(req.body);
  if (validBody.error) {
    return res.status(401).json(validBody.error.details)
  }
  try {
    let id = req.params.id;
    let data = await CategoryModel.updateOne({ _id: id }, req.body);
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


router.delete("/delete/:id", authAdmin, async (req, res) => {
  try {
    let id = req.params.id;

    // Find the category first
    let category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Extract the Public ID from the img_url
    let imageUrlComponents = category.img_url.split('/');
    let imagePublicId = imageUrlComponents[imageUrlComponents.length - 1].split('.')[0];

    // Delete the image from Cloudinary
    let result = await cloudinary.uploader.destroy(imagePublicId);

    if (result.error) {
      return res.status(500).json({ error: "Failed to delete image from Cloudinary" });
    }

    // If image deletion was successful, delete the category
    let data = await CategoryModel.deleteOne({ _id: id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred while deleting the category" })
  }
})




module.exports = router;