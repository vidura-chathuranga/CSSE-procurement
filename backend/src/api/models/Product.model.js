import { model, Schema } from "mongoose";

const ProductSchema = new Schema(
    {
        id: {
            type: Schema.Types.ObjectId,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        supplier: {
            type: Schema.Types.ObjectId,
            ref: "Supplier",
        },
        image: {
            type: String,
            // required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model("Product", ProductSchema);
