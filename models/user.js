const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    code: Number,
    dateExpire: Date,
  },
  email: String,
  setting:{
    
  }
});
userSchema.plugin(uniqueValidator);
userSchema.index({ "$**": "text" });

module.exports = mongoose.model("User", userSchema);
