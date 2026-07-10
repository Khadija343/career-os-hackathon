import fs from "fs/promises";
// Imported from the inner submodule (not the package root) because
// pdf-parse's root index.js runs a debug self-test on load whenever
// `module.parent` is undefined — which is always true under ESM
// interop — and that crashes with an unrelated ENOENT error.
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

/*
|--------------------------------------------------------------------------
| Whitespace Normalization
|--------------------------------------------------------------------------
| PDF/DOCX extraction commonly produces inconsistent line endings, runs
| of spaces/tabs, and excessive blank lines. We collapse those while still
| preserving paragraph breaks (max one blank line), so the text stays
| readable and predictable for whatever consumes it next (Phase 2 parsing).
*/
const normalizeWhitespace = (text) => {

    return text
        .replace(/\r\n/g, "\n")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

};

/**
 * Extract plain text from a resume file stored on disk.
 *
 * - "pdf"  -> parsed with pdf-parse
 * - "docx" -> parsed with mammoth (Office Open XML format)
 * - "doc"  -> legacy binary Word format; mammoth cannot reliably read
 *             this format, so it is explicitly rejected with a clear
 *             error rather than silently returning garbled text.
 *
 * Throws a plain Error on any failure; the caller (ResumeService) is
 * responsible for turning that into a resume "failed" status.
 */
const extractResumeText = async (filePath, fileType) => {

    try {

        if (fileType === "pdf") {

            const fileBuffer = await fs.readFile(filePath);
            const { text } = await pdfParse(fileBuffer);

            return normalizeWhitespace(text);

        }

        if (fileType === "docx") {

            const { value: text } = await mammoth.extractRawText({
                path: filePath,
            });

            return normalizeWhitespace(text);

        }

        if (fileType === "doc") {

            throw new Error(
                "Text extraction from legacy .doc files is not supported. Please re-upload as PDF or DOCX."
            );

        }

        throw new Error(
            `Unsupported file type for text extraction: "${fileType}".`
        );

    } catch (error) {

        // Wrap so the original cause (corrupt file, missing file, etc.)
        // is preserved in a single, consistent message for parseError.
        throw new Error(`Resume text extraction failed: ${error.message}`);

    }

};

export default extractResumeText;
