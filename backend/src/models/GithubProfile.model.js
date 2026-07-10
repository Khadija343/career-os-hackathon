import mongoose from "mongoose";

const githubProfileSchema = new mongoose.Schema(
    {
        /*
        |--------------------------------------------------------------------------
        | Ownership
        |--------------------------------------------------------------------------
        | One GitHub profile per user.
        */

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required."],
            unique: true,
            index: true,
        },

        /*
        |--------------------------------------------------------------------------
        | GitHub Profile Information
        |--------------------------------------------------------------------------
        | Mirrors the subset of fields returned by
        | GET https://api.github.com/users/:username that we care about.
        */

        username: {
            type: String,
            required: [true, "GitHub username is required."],
            trim: true,
            unique: true,
        },

        avatarUrl: {
            type: String,
            default: "",
        },

        profileUrl: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
        },

        publicRepos: {
            type: Number,
            default: 0,
        },

        followers: {
            type: Number,
            default: 0,
        },

        following: {
            type: Number,
            default: 0,
        },

        company: {
            type: String,
            default: "",
        },

        location: {
            type: String,
            default: "",
        },

        blog: {
            type: String,
            default: "",
        },

        githubCreatedAt: {
            type: Date,
            default: null,
        },

        lastSyncedAt: {
            type: Date,
            default: Date.now,
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
| Model
|--------------------------------------------------------------------------
*/

const GithubProfile = mongoose.model("GithubProfile", githubProfileSchema);

export default GithubProfile;
