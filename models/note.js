const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		default: "",
	},
    status: {
        type: boolean,
        default: false,
    },
	dateCreated: {
		type: Date,
		default: Date.now,
	},
    user:{
        type: mongoose.Schema.Types.ObjectId,
		ref: "User",
    }
});

module.exports = mongoose.model("Note", noteSchema);
