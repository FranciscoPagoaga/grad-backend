import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import multer from "multer";
import path from "path"
import { fileURLToPath } from "url";
import { signUp } from "./controllers/auth"
import userModel from "./models/user";
import userRoutes from "./routes/users";
import postRoutes from "./routes/posts";
import authRoutes from "./routes/auth";


const app = express();

app.use(express.json());

// File Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function(req,file,cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

/* Routes With Files */
app.post("/api/auth/signup", upload.single("picture"), signUp);

//routes
app.use("/api/auth", authRoutes)

app.use("/api/users", userRoutes);

app.use("/api/posts", postRoutes);

app.use((req, res, next) => {
  next(createHttpError("Endpoint not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error ocurred";
  let statusCode = 500;
  if(isHttpError(error)){
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
