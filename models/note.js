const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  id:{
    type: String,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  tagId: {
    type: String,
    default: "DEFAULT",
  },
  isPin: {
    type: Boolean,
    default: false,
  },
  dateNotify: String,
  password: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Note", noteSchema);
