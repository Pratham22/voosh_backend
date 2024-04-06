import mongoose from "mongoose";

// const Schema = mongoose.Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: { type: String, require: true, trim: true },
    image: { type: String, default: "" },
    country: { type: String, default: "" },
    bio: { type: String, default: "" },
    phone: { type: String, default: "" },
    timeZone: { type: String },
    role: { type: String, default: "user" },
    googlekey: { type: String },
    token: { type: String },
    isActive: { type: Boolean, default: true },
    isPrivate: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    lastlogin: { type: Date, default: Date.now() },
});

// userSchema.plugin(mongooseLeanGetter);
const User = mongoose.model("User", userSchema);
export default User;
