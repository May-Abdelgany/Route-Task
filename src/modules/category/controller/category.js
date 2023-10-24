import { asyncHandler } from "../../../utils/errorHandling.js";
import categoryModel from '../../../../DB/models/category.js'
import taskModel from "../../../../DB/models/task.js";

//add unique category 
export const addCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    const category = await categoryModel.findOne({ name })
    //check if category exist
    if (category) return next(new Error("category already exist", { cause: 400 }));
    const newCategory = new categoryModel({ name, userId: req.user._id })
    //add category to DB
    await newCategory.save()
    return res.status(201).json({ message: "Done", category: newCategory, status: 201 })
})

//get all categories
export const getCategories = asyncHandler(async (req, res, next) => {
    const categories = await categoryModel.find().populate([
        {
            path: 'userId',
            select: '_id name email'
        },
    ])
    // if exist categories
    if (categories.length) return res.status(200).json({ message: "Done", categories, status: 200 })
    // if not exist categories
    return next(new Error("notExist", { cause: 404 }));
})

//get one category
export const getCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    //find category by id
    const category = await categoryModel.findOne({ _id: id }).populate([
        {
            path: 'userId',
            select: '_id name email'
        }
    ])
    // if exist category
    if (category) return res.status(200).json({ message: "Done", category, status: 200 })
    // if not exist category
    return next(new Error("notExist", { cause: 404 }));
})

//update category
export const updateCategory = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params
        const { name } = req.body
        //find category by name
        const category = await categoryModel.findOne({ name })
        // if category name exist
        if (category) return next(new Error("name of category already exist", { cause: 400 }));
        //check if have access to update this category
        if (category.userId.toString() !== req.user._id.toString()) return next(new Error("you don't have access", { cause: 401 }));
        //find category by id if exist update name of category
        const updatedCategory = await categoryModel.findByIdAndUpdate({ _id: id }, { name }, { new: true })
        if (!updatedCategory) return next(new Error("category not found", { cause: 404 }));
        return res.status(200).json({ message: "Done", category: updatedCategory, status: 200 })
    }
)

//delete category
export const deleteCategory = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params
        //delete category if exist
        const deletedCategory = await categoryModel.findByIdAndDelete({ _id: id })
        if (!deletedCategory) return next(new Error("category not found", { cause: 404 }));
        //delete all tasks of this category
        await taskModel.deleteMany({ categoryId: id })
        return res.status(200).json({ message: "Done", category: deletedCategory, status: 200 })
    }
)