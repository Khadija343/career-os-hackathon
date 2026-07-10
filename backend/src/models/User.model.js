import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        /*
        |--------------------------------------------------------------------------
        | Basic Information
        |--------------------------------------------------------------------------
        */

        fullName: {
            type: String,
            required: [true, "Full name is required."],
            trim: true,
            minlength: 3,
            maxlength: 100,
        },

        email: {
            type: String,
            required: [true, "Email is required."],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            match: [
                /^\S+@\S+\.\S+$/,
                "Please provide a valid email address.",
            ],
        },

        password: {
            type: String,
            required: [true, "Password is required."],
            minlength: 8,
            select: false,
        },

        avatar: {
            type: String,
            default: "",
        },

        /*
        |--------------------------------------------------------------------------
        | Authentication
        |--------------------------------------------------------------------------
        */

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        provider: {
            type: String,
            enum: ["local", "google", "github"],
            default: "local",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        lastLogin: {
            type: Date,
            default: null,
        },

        /*
        |--------------------------------------------------------------------------
        | Career Profile
        |--------------------------------------------------------------------------
        */

        careerGoal: {
            type: String,
            trim: true,
            default: "",
        },

        profileCompleted: {
            type: Boolean,
            default: false,
        },

        /*
        |--------------------------------------------------------------------------
        | Soft Delete
        |--------------------------------------------------------------------------
        */

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Model
|--------------------------------------------------------------------------
*/

const User = mongoose.model("User", userSchema);

export default User;