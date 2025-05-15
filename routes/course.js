import { Router } from "express";

const courseRouter = Router();

courseRouter.post("/purchases", (req, res) => {
  res.json({
    message: "Signin endpoint",
  });
});

courseRouter.get("/preview", (req, res) => {
  res.json({
    message: "Course Preview",
  });
});

export { courseRouter };
