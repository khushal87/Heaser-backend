const express = require("express");
const Router = express.Router();

const wakatimeController = require("../controller/WakaTime");

Router.get("/main-wakatime", wakatimeController.mainWakaTimeFunctionality);
Router.get(
    "/get-employee-wakatime-id/:id",
    wakatimeController.getSpecificEmployeeWakaTimeId
);
Router.post("/create-wakatime-id", wakatimeController.createEmployeeWakatimeId);

module.exports = Router;
