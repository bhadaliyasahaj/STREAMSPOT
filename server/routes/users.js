import express from "express";
import {
  addhistory,
  deleteUser,
  dislike,
  getUser,
  like,
  logout,
  newrefreshtoken,
  subscribe,
  unsubscribe,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

//Update User
router.put("/:id", verifyToken, updateUser);

//Delete User
router.delete("/:id", verifyToken, deleteUser);

//Get User
router.get("/find/:id", getUser);

//Subscribe User
router.put("/sub/:id", verifyToken, subscribe);

//Unsubscribe User
router.put("/unsub/:id", verifyToken, unsubscribe);

//Like Video
router.put("/like/:videoId", verifyToken, like);

//Dislike Video
router.put("/dislike/:videoId", verifyToken, dislike);

//Logout User
router.post("/logout/:id", verifyToken, logout);

//History of User
router.put("/history/:videoId", verifyToken, addhistory);

//verify user
router.get("/verify",verifyToken)

//generate new access token
router.post("/refreshtoken",newrefreshtoken)

//retrive subscriber

export default router;
