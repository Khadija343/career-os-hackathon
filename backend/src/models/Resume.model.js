import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
    {
        /*
        |--------------------------------------------------------------------------
        | Ownership
        |--------------------------------------------------------------------------
        */

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required."],
            index: true,
        },

        /*
        |--------------------------------------------------------------------------
        | File Information
        |--------------------------------------------------------------------------
        */

        originalFileName: {
            type: String,
            required: [true, "Original file name is required."],
            trim: true,
        },

        storedFileName: {
            type: String,
            required: [true, "Stored file name is required."],
            trim: true,
        },

        filePath: {
            type: String,
            required: [true, "File path is required."],
            trim: true,
        },

        fileType: {
            type: String,
            enum: ["pdf", "doc", "docx"],
            required: [true, "File type is required."],
        },

        fileSize: {
            type: Number,
            required: [true, "File size is required."],
        },

        /*
        |--------------------------------------------------------------------------
        | Processing Status
        |--------------------------------------------------------------------------
        */

        status: {
            type: String,
            enum: ["uploaded", "processing", "parsed", "structured", "failed"],
            default: "uploaded",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        /*
        |--------------------------------------------------------------------------
        | Parsing & AI (reserved for later phases)
        |--------------------------------------------------------------------------
        */

        rawText: {
            type: String,
            default: "",
        },

        parsedData: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },

        parseError: {
            type: String,
            default: "",
        },

        parsedAt: {
            type: Date,
            default: null,
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

resumeSchema.index({ user: 1, isActive: 1 });

/*
|--------------------------------------------------------------------------
| Model
|--------------------------------------------------------------------------
*/

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
