import { Router } from "express";
import * as taskController from "./controller/task.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./task.validation.js";
import { auth } from '../../middleware/auth.js'
const router = Router();
router
    .post('/', validation(validators.addTask), auth('must'), asyncHandler(taskController.addTask))
    .patch('/:id', validation(validators.updateTask), auth('must'), asyncHandler(taskController.updateTask))
    .delete('/:id', validation(validators.deleteTask), auth('must'), asyncHandler(taskController.deleteTask))
    .get('/:id', auth('optional'), validation(validators.getTask), asyncHandler(taskController.getTask))
    .get('/byCategory/:id', auth('optional'), validation(validators.getTaskByCategory), asyncHandler(taskController.getTasksOfCategory))
    .get('/', auth('optional'), asyncHandler(taskController.getTasks))
export default router;