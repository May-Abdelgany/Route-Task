import { asyncHandler } from "../../../utils/errorHandling.js";
import taskModel from '../../../../DB/models/task.js'
import categoryModel from "../../../../DB/models/category.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";

//add unique task 
export const addTask = asyncHandler(async (req, res, next) => {
    const { task } = req.body
    //add array of tasks
    if (task.length) {
        let allTasks = []
        for (const element of task) {
            const category = await categoryModel.findById(element.categoryId)
            // if not exist category
            if (!category) return next(new Error("category not found", { cause: 404 }));
            if (category.userId.toString() !== req.user._id.toString()) return next(new Error("you don't have access to add task to this category", { cause: 401 }));
            element.userId = req.user._id
            allTasks.push(element)
        }
        const tasks = await taskModel.create(task)
        return res.status(201).json({ message: "Done", tasks, status: 201 })
    }
    //add one task
    const category = await categoryModel.findById(task.categoryId)
    // if not exist category
    if (!category) return next(new Error("category not found", { cause: 404 }));
    if (category.userId.toString() !== req.user._id.toString()) return next(new Error("you don't have access to add task to this category", { cause: 401 }));
    task.userId = req.user._id
    const newTask = await taskModel.create(task)
    return res.status(201).json({ message: "Done", task: newTask, status: 201 })
})


//get all tasks
export const getTasks = asyncHandler(async (req, res, next) => {
    let condition = {}
    if (req.user) {
        condition = {
            $or: [
                { privacy: 'private', userId: req.user._id },
                { privacy: 'public' }
            ]
        }
    }
    else {
        condition = { privacy: 'public' }
    }
    if (req.query.categoryName) {
        const category = await categoryModel.findOne({ name: req.query.categoryName })
        delete req.query.categoryName
        req.query.categoryId = category._id
    }
    const apiFeatureInstance = new ApiFeatures(taskModel.find(condition).populate([
        {
            path: 'userId',
            select: '_id name email'
        },
        {
            path: 'categoryId',
            select: '_id name',
            options: {
                sort: { name: 1 }
            }
        },
    ]), req.query).filter().sort().pagination().select();
    let tasks = await apiFeatureInstance.mongooseQuery
    const totalTasks = await taskModel.count(condition)
    if (tasks.length) return res.status(200).json({ message: "Done", page: apiFeatureInstance.page, total: totalTasks, tasks, status: 200 })
    // if not exist any tasks
    return next(new Error("notExist", { cause: 404 }));



})

//get all tasks in category 
//get all tasks
export const getTasksOfCategory = asyncHandler(async (req, res, next) => {
    let condition = {}
    const { id } = req.params
    if (req.user) {
        condition = {
            $or: [
                { privacy: 'private', userId: req.user._id, categoryId: id },
                { privacy: 'public', categoryId: id }
            ]
        }
    }
    else {
        condition = { privacy: 'public', categoryId: id }
    }
    const apiFeatureInstance = new ApiFeatures(taskModel.find(condition).populate([
        {
            path: 'userId',
            select: '_id name email'
        },
        {
            path: 'categoryId',
            select: '_id name',
        },
    ]), req.query).filter().sort().pagination().select();
    let tasks = await apiFeatureInstance.mongooseQuery
    const totalTasks = await taskModel.count(condition)
    if (tasks.length) return res.status(200).json({ message: "Done", page: apiFeatureInstance.page, total: totalTasks, tasks, status: 200 })
    // if not exist any tasks
    return next(new Error("notExist", { cause: 404 }));
})
//get one task
export const getTask = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    //find task by id
    let condition = {}
    if (req.user) {
        condition = {
            $or: [
                { privacy: 'private', userId: req.user._id, _id: id },
                { privacy: 'public', _id: id }
            ]
        }
    }
    else {
        condition = { privacy: 'public', _id: id }
    }
    const task = await taskModel.findOne(condition).populate([
        {
            path: 'userId',
            select: '_id name email'
        },
        {
            path: 'categoryId',
            select: '_id name'
        },
    ])
    console.log(task);
    // if exist task
    if (task) return res.status(200).json({ message: "Done", task, status: 200 })
    // if not exist task
    return next(new Error("notExist", { cause: 404 }));
})

//update task
export const updateTask = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params
        const { taskBody, privacy } = req.body
        const task = await taskModel.findById({ _id: id })
        if (!task) return next(new Error("task not found", { cause: 404 }));
        const updatedTask = await taskModel.findByIdAndUpdate({ _id: id, userId: req.user._id }, { taskBody, privacy }, { new: true })
        if (!updatedTask) return next(new Error("you don't have access", { cause: 401 }));
        return res.status(200).json({ message: "Done", task: updatedTask, status: 200 })
    }
)

//delete task
export const deleteTask = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params
        //delete task if exist
        const deletedTask = await taskModel.findByIdAndDelete({ _id: id })
        if (!deletedTask) return next(new Error("task not found", { cause: 404 }));
        return res.status(200).json({ message: "Done", task: deletedTask, status: 200 })
    }
)