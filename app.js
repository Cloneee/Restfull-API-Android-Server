require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routers/user")
const todoRouter = require("./routers/todo")
const authJwt = require("./helpers/jwt");
const errorHandle = require("./helpers/error-handle");

const api = process.env.API_URL;
const app = express();
// Middleware
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
process.env.NODE_ENV !== "test"? app.use(authJwt()) : null
app.use(errorHandle);

mongoose.connect("mongodb+srv://user:user@learningmongo1.89tk5.gcp.mongodb.net/android?retryWrites=true")
// Routers

app.use(`${api}/user`, userRouter);
app.use(`${api}/todo`, todoRouter);
app.get("/", (req,res)=>{
	res.json({msg: "OK"})
})
app.use('*', (req,res)=>{
	res.status(404).json({err: "Path not found"})
})
app.listen(process.env.PORT || 3000, function () {
	console.log("Server is running http://localhost:" + process.env.PORT);
});
module.exports = app