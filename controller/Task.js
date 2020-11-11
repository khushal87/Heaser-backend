const { validationResult } = require("express-validator");
const Task = require("../model/Task");
const Employee = require("../model/Employee");

exports.getEmployeeTasks = async (req, res, next) => {
  const id = req.params.id;
  await Employee.findById(id)
    .then(async (result) => {
      if (!result) {
        const error = new Error("Could not find employee.");
        error.status = 404;
        throw error;
      } else {
        await Task.find({ to: id }).then((result) => {
          res.status(200).json({ message: "Tasks fetched", tasks: result });
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getTasksAllocatedByEmployee = async (req, res, next) => {
  const id = req.params.id;
  await Employee.findById(id)
    .then(async (result) => {
      if (!result) {
        const error = new Error("Could not find employee.");
        error.status = 404;
        throw error;
      } else {
        await Task.find({ from: id }).then((result) => {
          res.status(200).json({ message: "Tasks fetched", tasks: result });
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createTask = async (req, res, next) => {
  const { from, to } = req.body;
  await Employee.findById(from)
    .then(async (result) => {
      if (!result) {
        const error = new Error("Could not find from employee.");
        error.status = 404;
        throw error;
      } else {
        await Employee.findById(to).then(async (result) => {
          if (!result) {
            const error = new Error("Could not find from employee.");
            error.status = 404;
            throw error;
          } else {
            const { heading, description, startDate, endDate } = req.body;
            const task = new Task({
              from,
              to,
              heading,
              description,
              startDate,
              endDate,
            });
            await task.save().then(async (result) => {
              await res.status(200).json({
                message: "Task created successfully",
                organization: result,
              });
            });
          }
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateTask = async (req, res, next) => {
  const taskId = req.params.id;
  await Task.findById(taskId)
    .then(async (task) => {
      if (!task) {
        const error = new Error("Could not find task.");
        error.status = 404;
        throw error;
      }
      const { heading, description, startDate, endDate } = req.body;

      heading ? (task.heading = heading) : "";
      description ? (task.description = description) : "";
      startDate ? (task.startDate = startDate) : "";
      endDate ? (task.endDate = endDate) : "";
      await task.save();
    })
    .then(async (result) => {
      await res
        .status(200)
        .json({ message: "Updated task successfully!", result: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.markTaskAsCompleted = async (req, res, next) => {
  const taskId = req.params.id;

  await Task.findById(taskId)
    .then(async (task) => {
      if (!task) {
        const error = new Error("Could not find task.");
        error.status = 404;
        throw error;
      }

      task.isCompleted = true;
      return task.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Task completed successfully!", result: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
