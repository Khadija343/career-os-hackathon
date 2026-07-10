import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Connect GitHub Account
|--------------------------------------------------------------------------
| Mirrors GitHub's own username rules: alphanumeric characters and single
| hyphens only, no leading/trailing/consecutive hyphens, max 39 chars.
*/

export const connectGithubSchema = z.object({

    username: z
        .string()
        .trim()
        .min(1, "GitHub username is required.")
        .max(39, "GitHub username cannot exceed 39 characters.")
        .regex(
            /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,
            "Invalid GitHub username format."
        ),

});
