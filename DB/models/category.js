import { mongoose, Schema, model, Types } from "mongoose";

const categorySchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);
const categoryModel = mongoose.models.Category || model("Category", categorySchema);
export default categoryModel;