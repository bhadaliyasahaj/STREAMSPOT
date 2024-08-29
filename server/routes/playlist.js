import express from 'express'
import { verifyToken } from '../verifyToken.js';
import { addtoPlaylist, createPlaylist, deletePlaylist, getPlaylist, getPlaylistVideos, removefromPlaylist } from '../controllers/playlist.controller.js';

const router = express.Router();

router.post("/create",verifyToken,createPlaylist)

router.get("/get",verifyToken,getPlaylist)

router.put("/add/:id",verifyToken,addtoPlaylist)

router.get("/get/:id",verifyToken,getPlaylistVideos)

router.put("/remove",verifyToken,removefromPlaylist)

router.delete("/deletelist/:id",verifyToken,deletePlaylist)

export default router