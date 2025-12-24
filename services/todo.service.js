const mongoose = require("mongoose");
const Todo = require("../models/Todo");

function assertObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid todo id");
    err.statusCode = 400;
    throw err;
  }
}

function normalizeTodoPayload(data) {
  const payload = { ...data };

  // Convert dueDate from ISO string -> Date (if provided)
  if (payload.dueDate !== undefined) {
    if (payload.dueDate === null) payload.dueDate = null;
    else payload.dueDate = new Date(payload.dueDate);
  }

  return payload;
}

async function createTodo(data) {
  const payload = normalizeTodoPayload(data);
  const todo = await Todo.create(payload);
  return todo;
}

async function listTodos({ page = 1, limit = 10, completed, q, sort = "-createdAt" }) {
  const filter = {};

  if (typeof completed === "boolean") filter.completed = completed;
  if (q) filter.title = { $regex: q, $options: "i" };

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 10;
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Todo.find(filter).sort(sort).skip(skip).limit(safeLimit),
    Todo.countDocuments(filter),
  ]);

  return {
    items,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
}

async function getTodoById(id) {
  assertObjectId(id);

  const todo = await Todo.findById(id);
  if (!todo) {
    const err = new Error("Todo not found");
    err.statusCode = 404;
    throw err;
  }
  return todo;
}

async function updateTodo(id, data) {
  assertObjectId(id);

  const payload = normalizeTodoPayload(data);

  const todo = await Todo.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!todo) {
    const err = new Error("Todo not found");
    err.statusCode = 404;
    throw err;
  }

  return todo;
}

async function deleteTodo(id) {
  assertObjectId(id);

  const todo = await Todo.findByIdAndDelete(id);
  if (!todo) {
    const err = new Error("Todo not found");
    err.statusCode = 404;
    throw err;
  }

  return { deleted: true };
}

module.exports = {
  createTodo,
  listTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
