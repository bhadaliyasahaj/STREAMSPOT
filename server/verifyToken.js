import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  // console.log(token);

  if (!token) return next(createError(402, "You Are Not Authenticated"));
  jwt.verify(token, process.env.ACCESS_SECRETKEY, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(createError(402, "Access Token Is Expired"));
      }
      return next(createError(404,"something"));
    }
    req.user = user;
    next();
  });
};
