const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    code: String,
    dateExpire: Date,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  setting:{
    
  },
  verify: {
    type: Boolean,
    default: false,
  },
  modifiedDate: String
});
userSchema.plugin(uniqueValidator);
userSchema.index({ "$**": "text" });

module.exports = mongoose.model("User", userSchema);
