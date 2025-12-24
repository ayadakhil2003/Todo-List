const router = require("express").Router();
const todoRoutes = require("./todo.routes");

router.use("/todos", todoRoutes);
module.exports = router;
