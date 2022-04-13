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
          user: req.locals.payload.userId
      })
      await newTodo.save()
      return res.json(newTodo)
  });

module.exports = router;
