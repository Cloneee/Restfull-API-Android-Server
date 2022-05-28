const express = require("express");
const router = express.Router();
const Note = require("../models/note");

router
  .route("/")
  .get(async (req, res) => {
    const todos = await Note.find({ user: req.locals.payload.userId }).select({
      __v: false,
    });
    return res.json(todos);
  })
  .post(async (req, res) => {
    const newNote = await Note.create({
      title: req.body.title,
      message: req.body.message,
      tagId: req.body.tagId,
      user: req.locals.payload.userId,
    });
    const returnNote = await Todo.findById(newNote._id).select({ __v: false });
    return res.json(returnNote);
  })
  .delete(async (req, res) => {
    await Todo.deleteMany({});
    return res.send("Deleted all notes");
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const note = await Note.findById(req.params.id).select({
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
      let note = await Note.findById(req.params.id).select({ __v: false });
      if (!note) {
        return res.status(404).send("Not found");
      }
      note.title = req.body.title;
      note.message = req.body.message;
      note.tagId = req.body.tagId;
      await note.save();
      return res.json(note);
    } catch (error) {
      return res.status(500).send(error);
    }
  })
  .delete(async (req, res) => {
    try {
      const note = await Note.findByIdAndRemove(req.params.id);
      if (!note) {
        return res.status(404).send("ID not found");
      }
      return res.send("Success delete");
    } catch (error) {
      return res.status(500).send(error);
    }
  });
