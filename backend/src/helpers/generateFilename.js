import path from "path";

/**
 * Generate a collision-safe, filesystem-friendly filename while
 * preserving the original extension (e.g. resume-1719999999999-123456789.pdf)
 */
const generateFilename = (originalName) => {

    const extension = path.extname(originalName);

    const baseName = path
        .basename(originalName, extension)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-+|-+$)/g, "");

    const uniqueSuffix = `${Date.now()}-${Math.round(
        Math.random() * 1e9
    )}`;

    return `${baseName || "file"}-${uniqueSuffix}${extension}`;

};

export default generateFilename;
