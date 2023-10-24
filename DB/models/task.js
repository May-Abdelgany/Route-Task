import { Schema, model, Types, mongoose } from "mongoose";
const taskSchema = new Schema(
    {
        taskBody: {
            type: String,
            required: true
        },
        userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        categoryId: {
            type: Types.ObjectId,
            ref: "Category",
            required: true,
        },
        privacy: {
            type: String,
            enum: ["public", "private"],
            default: "public",
        },
    },
    {
        timestamps: true,
    }
);

const taskModel = mongoose.models.Task || model("Task", taskSchema);
export default taskModel;