const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");

const {routesInit} = require("./routes/configRoutes");
const fileUpload = require("express-fileupload");
require("./db/mongoConnect")

const app = express();
// מאפשר גם לדומיין שלא קשור לשרת לבצע בקשה 
app.use(cors());
app.use(fileUpload({
    limits: {fileSize: 1024 * 1024 * 5}
}))
// מגדיר לשרת שהוא יכול לקבל מידע מסוג ג'ייסון בבאדי בבקשות שהם לא גט
app.use(express.json());

// דואג שתקיית פאבליק כל הקבצים בה יהיו חשופים לצד לקוח
app.use(express.static(path.join(__dirname,"public")));

// פונקציה שמגדירה את כל הראוטים הזמנים באפליקציית
// צד שרת שלנו
routesInit(app);

// הגדרת שרת עם יכולות אפ שמייצג את האקספרס
const server = http.createServer(app);
// משתנה שיגדיר על איזה פורט אנחנו נעבוד
// אנסה לבדוק אם אנחנו על שרת אמיתי ויאסוף את הפורט משם אם לא ואנחנו לוקאלי יעבוד על 3002
let port = process.env.PORT || 3010;
// הפעלת השרת והאזנה לפורט המבוקש
server.listen(port);