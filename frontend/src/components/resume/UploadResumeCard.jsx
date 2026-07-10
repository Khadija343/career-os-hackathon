import { useState } from "react";
import aiService from "../../services/aiService";

const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx"];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function getFileExtension(fileName = "") {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

// Mirrors the backend's upload.middleware.js rules so invalid files are
// caught before hitting the network.
function validateFile(selectedFile) {
  if (!selectedFile) {
    return "Please select a resume file.";
  }

  if (!ALLOWED_EXTENSIONS.includes(getFileExtension(selectedFile.name))) {
    return "Only PDF, DOC and DOCX files are allowed.";
  }

  if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
    return `Resume file must not exceed ${MAX_FILE_SIZE_MB}MB.`;
  }

  return "";
}

function formatFileSize(bytes) {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

// Maps backend/network failures to a single user-facing message.
function getUploadErrorMessage(err) {
  if (!err?.response) {
    return "Unable to reach the server. Please check your connection and try again.";
  }

  const { status, data } = err.response;

  if (status === 400) {
    return data?.message || "Invalid resume file. Please check the file type and size.";
  }

  if (status === 401) {
    return data?.message || "Your session has expired. Please log in again.";
  }

  if (status >= 500) {
    return "Something went wrong on our end. Please try again later.";
  }

  return data?.message || "Upload failed. Please try again.";
}

function UploadResumeCard({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadedMeta, setUploadedMeta] = useState(null);

  // 📌 Selects + validates a file (from either the input or a drop)
  const selectFile = (selectedFile) => {
    setSuccess("");
    setUploadedMeta(null);

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  // 📌 Upload handler
  const handleUpload = async () => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    setError("");
    setSuccess("");
    setProgress(0);

    try {
      const response = await aiService.uploadResume(formData, (progressEvent) => {
        if (progressEvent.total) {
          setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      });

      // Real resume metadata returned by the backend (id, fileName,
      // fileType, fileSize, status, parsedData, etc.)
      const resumeMeta = response?.data || null;

      setUploadedMeta(resumeMeta);
      setSuccess("Resume uploaded successfully!");
      setFile(null);

      // Give the user a moment to see the confirmation before the parent
      // page swaps to the results view.
      window.setTimeout(() => {
        onUploadSuccess(resumeMeta);
      }, 800);
    } catch (err) {
      setError(getUploadErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // 📌 Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    selectFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-4">
        Upload Resume
      </h2>

      {/* DROP AREA */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
      >
        <p className="text-gray-500">
          Drag & drop your resume here
        </p>

        <p className="text-sm text-gray-400 mt-1">
          or choose file below
        </p>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          disabled={loading}
          onChange={(e) => selectFile(e.target.files[0])}
          className="mt-3"
        />

        <p className="text-xs text-gray-400 mt-2">
          PDF, DOC or DOCX up to {MAX_FILE_SIZE_MB}MB.
        </p>
      </div>

      {/* Selected file */}
      {file && (
        <p className="mt-2 text-green-600 text-sm">
          Selected: {file.name} ({formatFileSize(file.size)})
        </p>
      )}

      {/* ERROR (NO ALERTS) */}
      {error && (
        <div className="mt-3 bg-red-100 text-red-600 p-2 rounded">
          {error}
        </div>
      )}

      {/* SUCCESS + SAVED METADATA */}
      {success && (
        <div className="mt-3 bg-green-100 text-green-700 p-2 rounded">
          <p>{success}</p>
          {uploadedMeta && (
            <p className="mt-1 text-xs text-green-600">
              {uploadedMeta.originalFileName} · {uploadedMeta.fileType?.toUpperCase()} ·{" "}
              {formatFileSize(uploadedMeta.fileSize)} · Status: {uploadedMeta.status}
            </p>
          )}
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className={`mt-4 px-5 py-2 rounded text-white ${
          loading || !file ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? `Uploading... ${progress}%` : "Upload Resume"}
      </button>

      {/* UPLOAD PROGRESS */}
      {loading && (
        <div className="mt-4 w-full bg-gray-200 h-2 rounded overflow-hidden">
          <div
            className="h-2 bg-blue-500 rounded transition-all duration-200"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default UploadResumeCard;
