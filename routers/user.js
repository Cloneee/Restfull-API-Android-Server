const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { sendOTP } = require("../helpers/nodemailer");

const genOTP = () => {
  return {
    code: Math.floor(Math.random() * (1000000 - 100000) + 100000).toString(), // gen 6 digits code
    dateExpire: new Date(Date.now() + 5 * 60000),
  };
};

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
  const otp = genOTP();
  let newUser = new User({
    username: req.body.username,
    password: hashPassWord,
    email: req.body.email,
    otp: otp,
  });
  newUser.save(async (err) => {
    if (!err) {
      await sendOTP(newUser.email, newUser.otp.code);
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

router.route("/password/change").post(async (req, res) => {
  try {
    const foundUser = await User.findById(req.locals.payload.userId);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (bcrypt.compareSync(req.body.password, foundUser.password)) {
      let salt = parseInt(process.env.SALT_ROUND);
      let hashPassWord = bcrypt.hashSync(req.body.newPassword, salt);
      foundUser.password = hashPassWord;
      await User.findByIdAndUpdate(foundUser._id, { password: hashPassWord });
      return res.status(200).json({message: "Change password successfully."});
    } else {
      return res.status(400).json({ message: "Password is wrong!" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
router.route("/password/recover").post(async (req, res) => {
  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) {
    return res.status(404).json({ message: "User not found" });
  }
  if (req.body.otp != foundUser.otp.code) {
    return res.status(400).json({ message: "OTP not valid" });
  }
  let salt = parseInt(process.env.SALT_ROUND);
  let hashPassWord = bcrypt.hashSync(req.body.newPassword, salt);
  await User.findOneAndUpdate({email: req.body.email}, { password: hashPassWord });
  return res.status(200).json({ message: "Change password successfully." });
});

router.route("/email").post(async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "Email don't exist" });
    }
    if (user.otp.code !== req.body.otp) {
      return res.status(400).json({ message: "OTP not valid" });
    }
    if (user.otp.dateExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    await User.findOneAndUpdate({ email: user.email }, { verify: true });
    return res
      .status(200)
      .json({ message: "Verified email", email: user.email });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router
  .route("/otp")
  .post(async (req, res) => {
    //GET OTP code
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "Email don't exist" });
    }
    const otp = genOTP();
    const isSend = await sendOTP(user.email, otp.code);
    if (isSend) {
      await User.findOneAndUpdate({ email: user.email }, { otp: otp });
      return res.status(200).json({ message: "Check your email" });
    }
    return res.status(500).json({ message: "Something went wrong!" });
  })
  .put(async (req, res) => {
    // Check otp
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user.otp.code !== req.body.otp) {
        return res.status(400).json({ message: "OTP not valid" });
      }
      if (user.otp.dateExpire < Date.now()) {
        return res.status(400).json({ message: "OTP expired" });
      }
      return res.status(200).json({ message: "OTP valid", otp: user.otp.code });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  });

module.exports = router;
