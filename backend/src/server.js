// Must be the first import: static ES module imports below (e.g. "./app.js")
// are evaluated before this file's own top-level code runs, so calling
// dotenv.config() after those imports would leave process.env populated too
// late for modules (like app.js's CORS config) that read env vars at import
// time. The "dotenv/config" side-effect import loads .env as soon as it is
// evaluated, which — since it is listed first — happens before the other
// imports are evaluated.
import "dotenv/config";

import connectDB from "./config/database.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("======================================");
      console.log("🚀 Career OS Backend Running");
      console.log(`Environment : ${process.env.NODE_ENV}`);
      console.log(`Server      : http://localhost:${PORT}`);
      console.log("======================================");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();