const express = require("express");
const taskController = require("../controller/Task");

const Router = express.Router();

Router.get("/get-employee-tasks/:id", taskController.getEmployeeTasks);
Router.get(
  "/get-tasks-by-employees/:id",
  taskController.getTasksAllocatedByEmployee
);
Router.post("/create-task", taskController.createTask);
Router.put("/update-task/:id", taskController.updateTask);
Router.put("/mark-task-as-completed/:id", taskController.markTaskAsCompleted);

module.exports = Router;
