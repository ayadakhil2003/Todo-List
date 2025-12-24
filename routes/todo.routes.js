const router = require("express").Router();
const { z } = require("zod");

const validate = require("../middlewares/validate");
const todoController = require("../controllers/todo.controller");

// Schemas
const createTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(120),
    description: z.string().max(1000).optional(),
    completed: z.boolean().optional(),
    dueDate: z.string().datetime().optional(), // ISO string
    priority: z.enum(["low", "medium", "high"]).optional(),
  }),
});

const updateTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(120).optional(),
    description: z.string().max(1000).optional(),
    completed: z.boolean().optional(),
    dueDate: z.string().datetime().nullable().optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
  }),
});

// Routes
router.get("/", todoController.list);
router.post("/", validate(createTodoSchema), todoController.create);

router.get("/:id", todoController.getOne);
router.patch("/:id", validate(updateTodoSchema), todoController.update);
router.delete("/:id", todoController.remove);

module.exports = router;
