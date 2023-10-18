import { model, Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    deliveryDate: {
      type: Date,
      required: true,
    },
    site: {
      type: Schema.Types.ObjectId,
      ref: "Site",
    },
    status: {
      type: String,
      required: true,
    },
    specialNotes: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Manager",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Order", OrderSchema);
