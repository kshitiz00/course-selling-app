import { Router } from "express";
import { CourseModel, PurchaseModel, UserModel } from "../db.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userMidleware } from "../auth.js";

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
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
      await UserModel.create({
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

userRouter.post("/signin", async (req, res) => {
  try {
    const requestedBody = z.object({
      email: z.string().min(3).max(100).email(),
      password: z.string().min(3).max(10),
    });
    const { success, data, error } = requestedBody.safeParse(req.body);
    if (success) {
      const { email, password } = req.body;
      const User = await UserModel.findOne({
        email: email,
      });
      if (User) {
        const isPassMatch = await bcrypt.compare(password, User.password);
        if (isPassMatch) {
          const token = jwt.sign(
            {
              id: User._id.toString(),
            },
            process.env.JWT_USER
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

userRouter.get("/purchases", userMidleware, async (req, res) => {
  try {
    const userid = req.id;
    const purchases = await PurchaseModel.find({
      userid: userid,
    });
    if (purchases.length > 0) {
      const courses = await CourseModel.find({
        _id: { $in: purchases.map((x) => x.courseid) },
      });
      res.json({
        purchases: purchases,
        courses: courses,
      });
    } else {
      res.json({
        message: "No purchase",
      });
    }
  } catch (e) {
    res.json({
      message: "Something went wrong",
    });
  }
});

export { userRouter };
