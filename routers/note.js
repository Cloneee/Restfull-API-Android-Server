const express = require("express");
const router = express.Router();
const Note = require("../models/note");
const User = require("../models/user");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const todos = await Note.find({ user: req.locals.payload.userId }).select({
        __v: false,
      });
      return res.json(todos);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error.message });
    }
  })
  .post(async (req, res) => {
    const newNote = await Note.create({...req.body, user: req.locals.payload.userId});
    const returnNote = await Note.findById(newNote._id).select({ __v: false });

    return res.json(returnNote);
  })
  .delete(async (req, res) => {
    await Note.deleteMany({});
    return res.send("Deleted all notes");
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const note = await Note.find({id: req.params.id}).select({
        __v: false,
      });
      if (!note) {
        return res.send("Not found");
      }
      return res.json(note);
    } catch (error) {
      return res.status(500).send(error);
    }
  })
  .put(async (req, res) => {
    try {
      let note = await Note.findOneAndUpdate({id: req.params.id}, req.body, {new: true}).select({ __v: false });
      if (!note) {
        return res.status(404).send("Not found");
      }
      await note.save();
      return res.json(note);
    } catch (error) {
      return res.status(500).send(error);
    }
  })
  .delete(async (req, res) => {
    try {
      const note = await Note.findOneAndDelete({id: req.params.id});
      if (!note) {
        return res.status(404).send("ID not found");
      }
      return res.send("Success delete");
    } catch (error) {
      return res.status(500).send(error);
    }
  });

module.exports = router;
