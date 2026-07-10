import mongoose from "mongoose";

const githubRepositorySchema = new mongoose.Schema(
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

        githubProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GithubProfile",
            required: [true, "GitHub profile reference is required."],
            index: true,
        },

        /*
        |--------------------------------------------------------------------------
        | GitHub Repository Information
        |--------------------------------------------------------------------------
        | Mirrors the subset of fields returned by
        | GET https://api.github.com/users/:username/repos that we care about.
        | `githubRepoId` (GitHub's own numeric repo id) is globally unique and
        | is what upserts key off during sync.
        */

        githubRepoId: {
            type: Number,
            required: [true, "GitHub repository ID is required."],
            unique: true,
        },

        name: {
            type: String,
            required: [true, "Repository name is required."],
            trim: true,
        },

        fullName: {
            type: String,
            required: [true, "Repository full name is required."],
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        language: {
            type: String,
            default: "",
        },

        topics: {
            type: [String],
            default: [],
        },

        stars: {
            type: Number,
            default: 0,
        },

        forks: {
            type: Number,
            default: 0,
        },

        watchers: {
            type: Number,
            default: 0,
        },

        defaultBranch: {
            type: String,
            default: "",
        },

        license: {
            type: String,
            default: "",
        },

        homepage: {
            type: String,
            default: "",
        },

        htmlUrl: {
            type: String,
            default: "",
        },

        isPrivate: {
            type: Boolean,
            default: false,
        },

        isFork: {
            type: Boolean,
            default: false,
        },

        isArchived: {
            type: Boolean,
            default: false,
        },

        createdAtGithub: {
            type: Date,
            default: null,
        },

        updatedAtGithub: {
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
| Indexes
|--------------------------------------------------------------------------
*/

githubRepositorySchema.index({ user: 1, isDeleted: 1 });

/*
|--------------------------------------------------------------------------
| Model
|--------------------------------------------------------------------------
*/

const GithubRepository = mongoose.model("GithubRepository", githubRepositorySchema);

export default GithubRepository;
