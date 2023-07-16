const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");


exports.auth = (req,res,next) => {
  let token = req.header("x-api-key");
  if(!token){
    // 401 -> בעיית אבטחה
    return res.status(401).json({msg:"you must send token to this endpoint"})
  }
  try{
    // מנסה לקודד הפוך את הטוקן , אם לא מצליח
    // עובר לקצ'
    let decodeToken = jwt.verify(token,config.tokenSecret);
    // req -> מכיל מידע שקיים גם בפונקציה הנוכחית של אוט וגם בפונקציה
    // הבאה בשרשור של הראוט וככה אנחנו יכולים בקלות להעביר מידע
    // בין פונקציות בשרשור
    req.tokenData = decodeToken
    // נקסט- עובר לפונקציה הבאה בשקשור של הרואטר 
    next();
  }
  catch(err){
    return res.status(401).json({msg:"Token invalid or expired"})
  }
}
// בדיקת טוקן לאדמין
exports.authAdmin = (req,res,next) => {
  let token = req.header("x-api-key");
  if(!token){
    // 401 -> בעיית אבטחה
    return res.status(401).json({msg:"you must send token to this endpoint"})
  }
  try{
    let decodeToken = jwt.verify(token,config.tokenSecret);
    if(decodeToken.role != "admin"){
      return res.status(401).json({msg:"You must send token of admin to this endpoint"})
    }
    req.tokenData = decodeToken
    next();
  }
  catch(err){
    return res.status(401).json({msg:"Token invalid or expired"})
  }
}