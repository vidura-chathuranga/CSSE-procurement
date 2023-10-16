import { model, Schema } from "mongoose";

const ManagerSchema = new Schema(
    {
        id: {
            type: Schema.Types.ObjectId,
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model("Manager", ManagerSchema);