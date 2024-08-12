import { createError } from "../error.js"
import Comment from "../models/Comment.model.js"
import Video from "../models/Video.model.js"

export const addComment = async (req,res,next)=>{
    const newComment = new Comment({...req.body,userId:req.user.id})
    try{
        const savedComment = await newComment.save()
        res.status(200).json(savedComment)
    }catch(err){
        next(err)
    }
}

export const deleteComment = async (req,res,next)=>{
    console.log("running")
    try{
        const comment = await Comment.findById(req.params.id)
        const video = await Video.findById(comment.videoID)
        if(req.user.id === comment.userId || req.user.id === video.userId){
            await Comment.findByIdAndDelete(req.params.id)
            res.status(200).json("The Comment Has Been Deleted")
        }else{
            next(createError(404,"You Can Only Delete Your Comment!!"))
        }
    }catch(err){
        next(err)
    }
}

export const getComments = async (req,res,next)=>{
    try{
        const comments = await Comment.find({videoID:req.params.videoId})
        res.status(200).json(comments.sort((a,b)=>b.createdAt - a.createdAt))
    }catch(err){
        next(err)
    }
}
