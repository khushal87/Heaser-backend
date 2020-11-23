const express = require("express");
const Router = express.Router();
const coursesController = require("../controller/Course");

Router.get("/get-courses", coursesController.getCourses);

module.exports = Router;
