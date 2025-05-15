import jwt from "jsonwebtoken";

const adminMiddleware = (req, res, next) => {
  try {
    const { token } = req.headers;
    const decodedAdmin = jwt.verify(token, process.env.JWT_ADMIN);
    if (decodedAdmin) {
      req.id = decodedAdmin.id;
      next();
    } else {
      res.json({
        message: "Something went wrong",
      });
    }
  } catch (e) {
    res.json({
      message: "Something went wrong",
    });
  }
};

const userMidleware = (req, res, next) => {
  try {
    const { token } = req.headers;
    const decodedUser = jwt.verify(token, process.env.JWT_USER);
    if (decodedUser) {
      req.id = decodedUser.id;
      next();
    } else {
      res.json({
        message: "Something went wrong",
      });
    }
  } catch (e) {
    res.json({
      message: "Something went wrong",
    });
  }
};

export { adminMiddleware, userMidleware };
