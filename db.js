import mongoose from "mongoose";
import { Schema } from "mongoose";
import dotenv from "dotenv";
const ObjectId = mongoose.Types.ObjectId;
dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
  });

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: String,
  firstname: String,
  lastname: String,
});

const adminSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: String,
  firstname: String,
  lastname: String,
});

const courseSchema = new Schema({
  title: { type: String, unique: true, required: true },
  description: String,
  price: Number,
  imageurl: String,
  creatorid: ObjectId,
});

const purchaseSchema = new Schema({
  courseid: ObjectId,
  userid: ObjectId,
});

const UserModel = mongoose.model("users", userSchema);
const AdminModel = mongoose.model("admins", adminSchema);
const CourseModel = mongoose.model("courses", courseSchema);
const PurchaseModel = mongoose.model("purchases", purchaseSchema);

export { UserModel, AdminModel, CourseModel, PurchaseModel };
