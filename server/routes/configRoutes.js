const indexR = require("./index");
const usersR = require("./users");
const categoriesR = require("./categories");
const questionsR = require("./questions");
const uploadR = require("./upload");



exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/categories",categoriesR);
  app.use("/questions", questionsR);
  app.use("/upload", uploadR);



// כל ראוט אחר שנגיע שלא קיים בתקיית פאליק או כראוט
// נקבל 404
  app.use("*",(req,res) => {
    res.status(404).json({msg:"endpoint not found , 404",error:404})
  })
}