import { Router } from "express";
import { userMidleware } from "../auth.js";
import { CourseModel, PurchaseModel } from "../db.js";
const courseRouter = Router();

courseRouter.post("/purchases", userMidleware, async (req, res) => {
  try {
    const userId = req.id;
    const { courseid } = req.body;
    await PurchaseModel.create({
      courseid,
      userid: userId,
    });
    res.json({
      message: "Purchase completed",
    });
  } catch (error) {
    res.json({
      message: "Something went wrong",
    });
  }
});

courseRouter.get("/preview", async (req, res) => {
  try {
    const courses = await CourseModel.find({});
    res.json({
      courses: courses,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong",
    });
  }
});

export { courseRouter };
