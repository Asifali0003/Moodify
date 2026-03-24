const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const historyController = require("../controllers/history.controller");

const historyRouter = express.Router();


historyRouter.post("/:songId",authMiddleware,historyController.saveHistory); 
historyRouter.get("/",authMiddleware,historyController.getUserHistory);
historyRouter.delete("/:id",authMiddleware,historyController.deleteHistory);
historyRouter.delete("/",authMiddleware,historyController.clearHistory);

module.exports = historyRouter;