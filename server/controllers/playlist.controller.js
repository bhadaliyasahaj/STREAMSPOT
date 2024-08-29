import { createError } from "../error.js"
import Playlist from '../models/Playlist.model.js'
import Video from '../models/Video.model.js'


export const createPlaylist = async (req, res, next) => {
    try {
        const playlist = new Playlist({ userId: req.user.id, ...req.body })
        await playlist.save()
        res.status(200).json({ message: "playlist is created" })
    } catch (error) {
        next(createError(404, "Some Error Occurred While Creating Playlist"))
    }
}

export const getPlaylist = async (req, res, next) => {
    try {
        const playlists = await Playlist.find({ userId: req.user.id })
        const images = await Promise.all(
            playlists.map(async (list) => {
                try {
                    let video = await Video.findById(list.playlist[0])
                    return (video.imgUrl)
                } catch (err) {
                    console.log(err);
                    return ""
                }
            })
        )
        console.log(images);
        res.status(200).json({ playlists, images })
    } catch (error) {
        next(createError(404, "Some Error Occurred While Getting Playlist"))
    }
}

export const addtoPlaylist = async (req, res, next) => {
    try {
        const playlistsArr = req.body
        console.log(playlistsArr);
        console.log(req.params.id);

        playlistsArr.map(async (list) => {
            await Playlist.findByIdAndUpdate(list, {
                $addToSet: { playlist: req.params.id }
            })
        })
        res.status(200).json({ meesage: "video added to playlist" })
    } catch (error) {
        next(createError(404, "Some Error Occurred While Adding to Playlist"))
    }
}

export const getPlaylistVideos = async (req, res, next) => {
    try {
        const list = await Playlist.findById(req.params.id);
        const videos = await Promise.all(
            list.playlist.map(async (item) => {
                try {
                    const video = await Video.findById(item)
                    return video ? video : { id: item }
                } catch (err) {
                    console.log(err);
                    return { item }
                }
            })
        )
        res.status(200).json(videos)
    } catch (error) {
        next(createError(404, "Some Error Occurred While Adding to Playlist"))
    }
}

export const removefromPlaylist = async (req, res, next) => {
    try {
        const vidid = req.body.vidid;
        const playlistid = req.body.plid;
        console.log(vidid, playlistid);

        const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistid, {
            $pull: { playlist: vidid }
        })
        return res.status(200).json(updatedPlaylist)
    } catch (err) {
        console.log(err);
        next(createError(403, "Error in removing video from playlist"))
    }
}

export const deletePlaylist = async (req,res,next)=>{
    try {
        await Playlist.findByIdAndDelete(req.params.id)
        res.status(200).json("Playlist Deleted Successfully")
    } catch (error) {
        next(createError(402,"Error In Deletion Of Playlist"))
    }
}