import { createError } from "../error.js";
import Subscribe from "../models/Subscribe.model.js";
import User from "../models/User.model.js";
import Video from "../models/Video.model.js";
import JWT from "jsonwebtoken";
import bcrypt from 'bcrypt'

export const updateUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      if (req.body.img) {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );

      } else {
        const { name, password } = req.body
        const hashPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: { name, password: hashPassword },
          },
          { new: true }
        );
      }

      res.status(200).json(updatedUser);
    } catch (err) {
      console.log(err);

      next(err);
    }
  } else {
    return next(createError(403, "You Can Update Only Your Account"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res
        .status(500)
        .clearCookie("access_token")
        .json("User Has Been Deleted!!");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You Can Delete Only Your Account"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const subscribe = async (req, res, next) => {
  // console.log(req.params.id);

  try {
    // Update the subscription list
    await User.findByIdAndUpdate(req.user.id,
      { $push: { subscribedUsers: req.params.id } },
      { new: true }
    );

    // Increment the subscribers count
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });

    //Add Data To Subscriber Model
    const subscriber = new Subscribe({
      subscribedFrom: req.user.id,
      subscribedTo: req.params.id
    })

    await subscriber.save()

    res.status(201).json("You Have Subscribed!!");
  } catch (err) {
    next(err);
  }
};

export const unsubscribe = async (req, res, next) => {

  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 },
    });
    res.status(201).json("You Have Unsubscribed!!");
  } catch (err) {
    console.log(err);

    next(err);
  }
};

export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: id },
      $pull: { dislikes: id },
    });
    res.status(200).json("The Video Has Been Liked");
  } catch (err) {
    next(err);
  }
};

export const dislike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: id },
      $pull: { likes: id },
    });
    res.status(200).json("The Video Has Been Disliked");
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res, next) => {
  if (req.user.id === req.params.id) {
    res
      .clearCookie("access_token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .clearCookie("refresh_token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json({ message: "Cookie cleared" });
  } else {
    next(createError(404, "Cannot Logout"));
  }
};

export const addhistory = async (req, res, next) => {
  try {
    if (req.user) {
      const addtohistory = await User.findByIdAndUpdate(
        req.user.id,
        {
          $addToSet: { history: req.params.videoId },
        },
        { new: true },
      );
      res.status(200).json(addtohistory);
    }
  } catch (err) {
    next(err);
  }
};

export const newrefreshtoken = async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token)
      return next(createError(404, "Refresh Token Not Found"));
    const response = JWT.verify(refresh_token, process.env.REFRESH_SECRETKEY);
    const user = await User.findById(response.id);
    if (!user) return next(createError(404, "User Not Found"));

    const newAccess_Token = user.createAccessToken();
    const newRefresh_Token = user.createRefreshToken();

    // console.log("new generated");

    res
      .cookie("access_token", newAccess_Token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 365 * 24 * 60 * 60 * 1000,
      })
      .cookie("refresh_token", newRefresh_Token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 365 * 24 * 60 * 60 * 1000,
      }).status(200).json({ accessToken: newAccess_Token, refreshToken: newRefresh_Token })
  } catch (error) {
    next(createError(403, "Invalid Refresh Token"))
  }
};
