import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

const app = express();
dotenv.config();
const server = http.createServer(app);
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization,multipart/form-data"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.set("trust proxy", true);

app.use(routes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

mongoose.connect(process.env.DB_URL, {
}).then(() => console.log("DB CONNECTED",process.env.DB_URL))
