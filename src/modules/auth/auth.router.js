import { Router } from "express";
import * as authController from "./controller/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";

import * as validators from "./auth.validation.js";
const router = Router();
router.post('/signUp', validation(validators.signUp), asyncHandler(authController.signUp))
router.post('/login', validation(validators.login), asyncHandler(authController.login))
export default router;