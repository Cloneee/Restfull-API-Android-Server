const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");

router
  .route("/")
  .get(async (req, res) => {
    const todos = await Todo.find({ user: req.locals.payload.userId }).select({
      __v: false,
    });
    return res.json(todos);
  })
  .post(async (req, res) => {
    const newTodo = new Todo({
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
      user: req.locals.payload.userId,
    });
    await newTodo.save();
    return res.json(newTodo);
  })
  .delete(async (req, res) => {
    await Todo.deleteMany({});
    return res.send("Deleted all todos");
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.send("Not found");
      }
      return res.json(todo);
    } catch (error) {
      return res.status(500).send(error)
    }
  })
  .put(async (req, res) => {
    try {
      let todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.status(404).send("Not found");
      }
      todo.title = req.body.title;
      todo.content = req.body.content;
      todo.status = req.body.status;
      await todo.save();
      return res.json(todo);
    } catch (error) {
      return res.status(500).send(error);
    }
  })
  .delete(async (req, res) => {
    try {
      const todo = await Todo.findByIdAndRemove(req.params.id);
      if (!todo) {
        return res.status(404).send("ID not found");
      }
      return res.send("Success delete");
    } catch (error) {
      return res.status(500).send(error);
    }
  });

module.exports = router;
