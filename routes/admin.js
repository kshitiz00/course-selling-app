import { Router } from "express";
import { AdminModel, CourseModel } from "../db.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { adminMiddleware } from "../auth.js";

const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
  try {
    const requestedBody = z.object({
      email: z.string().min(3).max(100).email(),
      password: z.string().min(3).max(10),
      firstname: z.string().min(3).max(10),
      lastname: z.string().min(3).max(10),
    });

    const { success, data, error } = requestedBody.safeParse(req.body);
    if (success) {
      const { email, password, firstname, lastname } = req.body;
      const hashedPaaword = await bcrypt.hash(password, 5);
      await AdminModel.create({
        email: email,
        password: hashedPaaword,
        firstname: firstname,
        lastname: lastname,
      });
      res.json({
        message: "Signup Success",
      });
    } else {
      res.json({
        message: "Invalid Credentials",
      });
    }
  } catch (e) {
    res.json({
      message: "Something went wrong",
    });
  }
});

adminRouter.post("/signin", async (req, res) => {
  try {
    const requestedBody = z.object({
      email: z.string().min(3).max(100).email(),
      password: z.string().min(3).max(10),
    });
    const { success, data, error } = requestedBody.safeParse(req.body);
    if (success) {
      const { email, password } = req.body;
      const admin = await AdminModel.findOne({
        email: email,
      });
      if (admin) {
        const isPassMatch = await bcrypt.compare(password, admin.password);
        if (isPassMatch) {
          const token = jwt.sign(
            {
              id: admin._id.toString(),
            },
            process.env.JWT_ADMIN
          );
          res.json({
            token: token,
          });
        } else {
          res.json({
            message: "Password not matched",
          });
        }
      } else {
        res.json({
          message: "User does not exist",
        });
      }
    } else {
      res.json({
        message: "Invalid Credentials",
      });
    }
  } catch (e) {
    res.json({
      message: "Something went wrong",
    });
  }
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
  try {
    const requestedBody = z.object({
      title: z.string().min(3).max(100),
      description: z.string().min(3).max(1000),
      price: z.number().min(3).max(100000),
      imageurl: z.string().min(3).max(10),
    });
    const { success, data, error } = requestedBody.safeParse(req.body);
    if (success) {
      const adminId = req.id;
      const { title, description, price, imageurl } = req.body;
      await CourseModel.create({
        title,
        description,
        price,
        imageurl,
        creatorid: adminId,
      });
      res.json({
        message: "Course Created",
      });
    } else {
      res.json({
        message: "Something is wrong",
      });
    }
  } catch (e) {
    res.json({
      message: "Something is wrong",
    });
  }
});

adminRouter.put("/course", adminMiddleware, (req, res) => {
  res.json({
    message: "Signin endpoint",
  });
});

adminRouter.get("/bulk", adminMiddleware, async (req, res) => {
  try {
    const adminId = req.id;
    const courses = await CourseModel.find({
      creatorid: adminId,
    });
    if (courses.length > 0) {
      res.json({
        courses: courses,
      });
    } else {
      res.json({
        message: "No courses found",
      });
    }
  } catch (e) {
    res.json({
      message: "Something went wrong",
    });
  }
});

export { adminRouter };
