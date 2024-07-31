import { createError } from "../error.js"
import User from "../models/User.model.js"

export const updateUser = async (req,res,next) =>{
    if(req.params.id === req.user.id){
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{new:true});
            res.status(500).json(updatedUser)
        }catch(err){
            next(err)
        }
    }else{
        return next(createError(403,"You Can Update Only Your Account"))
    }
}

export const deleteUser = async (req,res,next) =>{
    if(req.params.id === req.user.id){
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(500).clearCookie("access_token").json("User Has Been Deleted!!")
        }catch(err){
            next(err)
        }
    }else{
        return next(createError(403,"You Can Delete Only Your Account"))
    }
}

export const getUser = async (req,res,next) =>{
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}

export const subscribe = async (req,res,next) =>{
    try {
        await User.findByIdAndUpdate(req.user.id,{
            $push:{subscribedUsers:req.params.id}
        })
        await User.findByIdAndUpdate(req.params.id,{
            $inc:{subscribers: 1}
        })
        res.status(201).json("You Have Subscribed!!")
    } catch (err) {
        next(err)
    }
}

export const unsubscribe = async (req,res,next) =>{
    try {
        await User.findByIdAndUpdate(req.user.id,{
            $pull:{subscribedUsers:req.params.id}
        })
        await User.findByIdAndUpdate(req.params.id,{
            $inc:{subscribers: -1}
        })
        res.status(201).json("You Have Unsubscribed!!")        
    } catch (err) {
        next(err)
    }
}

export const like = async (req,res,next) =>{
    try {
        
    } catch (err) {
        next(err)
    }
}

export const dislike = async (req,res,next) =>{
    try {
        
    } catch (err) {
        next(err)
    }
}