import { Router } from "express";
import * as categoryController from "./controller/category.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./category.validation.js";
import { auth } from '../../middleware/auth.js'
const router = Router();
router
    .post('/', validation(validators.addCategory), auth('must'), asyncHandler(categoryController.addCategory))
    .patch('/:id', validation(validators.updateCategory), auth('must'), asyncHandler(categoryController.updateCategory))
    .delete('/:id', validation(validators.deleteCategory), auth('must'), asyncHandler(categoryController.deleteCategory))
    .get('/:id', auth('optional'), validation(validators.getCategory), asyncHandler(categoryController.getCategory))
    .get('/', auth('optional'), asyncHandler(categoryController.getCategories))
export default router;  