const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router()




router.post("/register",authController.registerUser); // /api/auth to register user
router.post("/login",authController.loginUser); // /api/auth to login user
router.get("/get-me",authMiddleware.authUser,authController.getMe); // /api/auth to get current user details
router.get("/logout",authMiddleware.authUser,authController.logoutUser); // /api/auth to logout user






authMiddleware.authUser
module.exports = router;    