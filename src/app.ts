import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import userModel from "./models/user";
import userRoutes from "./routes/users";
import postRoutes from "./routes/posts";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/posts", postRoutes);

app.get("/", async (req, res) => {
  const notes = await userModel.find().exec();
  res.status(200).json(notes);
});

app.use((req, res, next) => {
  next(Error("Endpoint not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error ocurred";
  if (error instanceof Error) errorMessage = error.message;
  res.status(500).json({ error: errorMessage });
});

export default app;
