import { Schema, model } from "mongoose";

// User Schema (Simplified for analytics)
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
});

// Review Sub-Schema embedded inside Products
const reviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true },
);

// Product Schema (Packed with fields for deep calculations)
const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, lowercase: true, trim: true },
    stock: { type: Number, required: true, min: 0 },
    salesCount: { type: Number, default: 0, min: 0 },
    reviews: [reviewSchema],
  },
  { timestamps: true },
);

export const User = model("User", userSchema);
export const Product = model("Product", productSchema);
