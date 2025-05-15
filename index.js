import express from "express";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.js";
import { courseRouter } from "./routes/course.js";
import { adminRouter } from "./routes/admin.js";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
dotenv.config();

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

const main = () => {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on Port ${process.env.PORT}`);
  });
};
main();
