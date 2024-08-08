import Express from "express";
const router = Express.Router();
import AuthController from "../Controller/AuthController.js";
import validateScehma from "../Middleware/ValidateSchema.js";
import AuthYup from "../Utils/Validation/AuthYup.js";

router.post("/register", validateScehma(AuthYup.registerSchema), AuthController.signUp)
router.post("/login", validateScehma(AuthYup.loginSchema), AuthController.signIn)
router.post("/forgotPassword", validateScehma(AuthYup.forgotPassword), AuthController.forgotPassword)

export default router