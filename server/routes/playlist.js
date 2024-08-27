import express from 'express'
import { verifyToken } from '../verifyToken.js';
import { addtoPlaylist, createPlaylist, getPlaylist, getPlaylistVideos } from '../controllers/playlist.controller.js';

const router = express.Router();

router.post("/create",verifyToken,createPlaylist)

router.get("/get",verifyToken,getPlaylist)

router.put("/add/:id",verifyToken,addtoPlaylist)

router.get("/get/:id",verifyToken,getPlaylistVideos)

export default router