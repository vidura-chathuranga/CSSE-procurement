import { model, Schema } from "mongoose";

const SiteSchema = new Schema(
    {
        id: {
            type: Schema.Types.ObjectId,
        },
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        manager: {
            type: Schema.Types.ObjectId,
            ref: "Manager",
        },
        status: {
            type: String,
            required: true,
            enum: ["planned", "ongoing", "completed"],
            default: "planned",
        },
    },
    {
        timestamps: true,
    }
);

export default model("Site", SiteSchema);