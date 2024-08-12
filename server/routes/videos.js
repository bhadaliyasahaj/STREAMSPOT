import express from "express";
import {
  addVideo,
  addView,
  category,
  deleteVideo,
  getByTag,
  gethistory,
  getVideo,
  myvideos,
  random,
  search,
  sub,
  trend,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

//Create A Video
router.post("/", verifyToken, addVideo);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/find/:id", getVideo);
router.put("/view/:id", addView);
router.get("/trend", trend);
router.get("/random", random);
router.get("/sub", verifyToken, sub);
router.get("/tags", getByTag);
router.get("/search", search);
router.get("/myvideos", verifyToken, myvideos);
router.get("/category/:cat", category);
router.get("/history", verifyToken, gethistory);

export default router;
