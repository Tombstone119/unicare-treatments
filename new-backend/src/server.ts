import express, { Express } from "express";
import "dotenv/config";
import cors from "cors";
import apiRouter from "./routes/index.ts";
// import { connectToMongoDB } from "./util/dbConnector.ts";
import { handleOtherErrors, handleURIError } from "./util/individualErrors.ts";

const createApp = (): Express => {
  const app = express();

  // connectToMongoDB();

  app.use(cors());
  app.use(express.json());
  app.use("/api", apiRouter);
  app.get("/healthcheck", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
  });
  app.use(handleURIError);
  app.use(handleOtherErrors);

  return app;
};

export default createApp;
