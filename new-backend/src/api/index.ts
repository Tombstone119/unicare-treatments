import { VercelRequest, VercelResponse } from "@vercel/node";
import createApp from "../server";
import { connectToMongoDB } from "../util/dbConnector";
import mongoose from "mongoose";

// Create Express app
const app = createApp();

let cachedConnection: typeof mongoose | null = null;

const connectToDatabase = async (): Promise<typeof mongoose> => {
  if (cachedConnection) {
    console.log("Using cached database connection");
    return cachedConnection;
  }

  console.log("Creating new database connection");
  const connection = await mongoose.connect(process.env.MONGODB_URL || "");
  cachedConnection = connection;
  return connection;
};

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<void> => {
  try {
    // Connect to database for each request (uses cache if available)
    await connectToMongoDB();

    // Process the request with Express
    return new Promise((resolve, reject) => {
      const expressReq = app._router.handle(req, res, (err: Error) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(undefined);
      });
    });
  } catch (error) {
    console.error("Serverless function error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "The server encountered an error processing your request",
    });
  }
};

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8081;
  app
    .listen(PORT, () => {
      connectToDatabase().then(() => {
        console.log(`Database connected and server is running on port ${PORT}`);
      });
      const now = new Date().toLocaleString();
      console.log(`[${now}] Server is up and running on port number: ${PORT}`);
    })
    .on("error", (error) => {
      console.error(`Error occurred: ${error.message}`);
    });
}
