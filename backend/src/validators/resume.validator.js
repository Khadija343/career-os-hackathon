import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Resume ID Route Param
|--------------------------------------------------------------------------
| The upload endpoint carries no validatable body (multer handles the
| file itself, and file type/size rules live in upload.middleware.js).
| This schema guards the :id param used by the get-by-id and delete routes.
*/

export const resumeIdParamSchema = z.object({
    id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid resume ID."),
});
