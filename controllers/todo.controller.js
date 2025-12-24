const todoService = require("../services/todo.service");

async function create(req, res, next) {
  try {
    const todo = await todoService.createTodo(req.body);
    res.status(201).json({ data: todo });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    // completed can be "true" / "false"
    let completed;
    if (req.query.completed === "true") completed = true;
    if (req.query.completed === "false") completed = false;

    const q = req.query.q || "";
    const sort = req.query.sort || "-createdAt";

    const result = await todoService.listTodos({ page, limit, completed, q, sort });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const todo = await todoService.getTodoById(req.params.id);
    res.json({ data: todo });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const todo = await todoService.updateTodo(req.params.id, req.body);
    res.json({ data: todo });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await todoService.deleteTodo(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, getOne, update, remove };
