import fs from "fs";
import path from "path";
import multer from "multer";

import ApiError from "../utils/ApiError.js";
import generateFilename from "../helpers/generateFilename.js";

/*
|--------------------------------------------------------------------------
| Upload Configuration
|--------------------------------------------------------------------------
*/

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "resumes");

const ALLOWED_MIME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE_MB = 5;

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/*
|--------------------------------------------------------------------------
| Multer Storage
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },

    filename: (req, file, cb) => {
        cb(null, generateFilename(file.originalname));
    },

});

const fileFilter = (req, file, cb) => {

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {

        return cb(
            new ApiError(400, "Only PDF, DOC and DOCX files are allowed.")
        );

    }

    cb(null, true);

};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    },
});

/*
|--------------------------------------------------------------------------
| Exported Middleware
|--------------------------------------------------------------------------
| Wraps multer so its errors are converted into ApiError, keeping the
| global error handler as the single place that formats error responses.
*/

const uploadResumeFile = (req, res, next) => {

    upload.single("resume")(req, res, (error) => {

        if (error instanceof multer.MulterError) {

            if (error.code === "LIMIT_FILE_SIZE") {

                return next(
                    new ApiError(
                        400,
                        `Resume file must not exceed ${MAX_FILE_SIZE_MB}MB.`
                    )
                );

            }

            if (error.code === "LIMIT_UNEXPECTED_FILE") {

                return next(
                    new ApiError(
                        400,
                        "Unexpected file field. Send exactly one file under the 'resume' field name (check for an extra/duplicate file row in your form-data)."
                    )
                );

            }

            return next(new ApiError(400, error.message));

        }

        if (error) {
            return next(error);
        }

        next();

    });

};

export default uploadResumeFile;
