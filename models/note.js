const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  tagId: {
    type: string,
    default: "DEFAULT",
  },
  isPin: {
    type: Boolean,
    default: false,
  },
  dateNotify: Date,
  password: string,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateDelete:{
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Note", noteSchema);
