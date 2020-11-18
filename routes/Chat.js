const express = require("express");
const Router = express.Router();

const chatController = require("../controller/ChatController");

Router.get("/get-chat-history", chatController.getChatHistory);

module.exports = Router;
