const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.route("/login").post((req, res) => {
  User.findOne({ username: req.body.username }, function (err, foundUser) {
    if (foundUser) {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        const secret = process.env.SECRET;
        const token = jwt.sign(
          {
            userId: foundUser._id,
          },
          secret,
          {
            expiresIn: "1y",
          }
        );
        return res.status(200).json({
          username: foundUser.username,
          token: token,
        });
      } else {
        return res.status(400).json({ message: "Password is wrong!" });
      }
    }
    return res.status(400).json({ message: "Username not found" });
  });
});

router.route("/register").post(async (req, res) => {
  let salt = parseInt(process.env.SALT_ROUND);
  let hashPassWord = bcrypt.hashSync(req.body.password, salt);
  let newUser = new User({
    username: req.body.username,
    password: hashPassWord,
    email: req.body.email || "",
  });
  newUser.save(function (err) {
    if (!err) {
      return res.status(200).send("Successfully register.");
    } else {
      return res.status(400).json({
        success: false,
        error: err.message,
        status: "Cannot register",
      });
    }
  });
});

router.route("/change-password")
  .post(async (req, res) => {
    const foundUser = await User.findById(req.locals.payload.userId)
    if (!foundUser) {
      return res.status(404).json({message: "User not found"})
    }
    if (bcrypt.compareSync(req.body.password, foundUser.password)) {
      let salt = parseInt(process.env.SALT_ROUND);
      let hashPassWord = bcrypt.hashSync(req.body.newPassword, salt);
      foundUser.password = hashPassWord
      foundUser.save(err =>{
        if (!err){
          return res.status(200).send("Change password successfully.");
        } else {
          return res.status(400).json({
            success: false,
            error: err.message,
            status: "Cannot change password",
          });
        }
      })
    } else {
      return res.status(400).json({ message: "Password is wrong!" });
    }
  });

router.route("/recover")
  .get(async (req, res) => {
    
  })
  .post(async (req, res) => {

  })

module.exports = router;
