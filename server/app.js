const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");

const { routesInit } = require("./routes/configRoutes");
const fileUpload = require("express-fileupload");
require("./db/mongoConnect")

const app = express();
app.use(cors());

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/', // temporary directory path
  limits: { fileSize: 1024 * 1024 * 5 }
}))

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get('/public/images/categories/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'public', 'images', 'categories', imageName);
  res.sendFile(imagePath);
});


routesInit(app);

const server = http.createServer(app);

let port = process.env.PORT || 3006;
server.listen(port);
console.log(port)