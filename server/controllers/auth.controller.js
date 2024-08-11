import User from '../models/User.model.js'
import bcrypt from 'bcrypt'
import { createError } from '../error.js'
import jwt from 'jsonwebtoken'
import {mailGenerator} from '../utils/emailGenerator.js'

export const signup = async (req,res,next)=>{
    try{
        const hashPass = await bcrypt.hash(req.body.password,10)
        const newUser = new User({...req.body, password: hashPass})
        await newUser.save();
        res.status(200).send("User Has Been Created")
    }catch(err){
        if(err.errorResponse.keyPattern.email === 1){
            next(createError(404,"Email Already Exist"));
        }else if(err.errorResponse.keyPattern.name === 1){
            next(createError(402,"Username Already Exist"))
        }else{
            next(err)
        }
    }
}

export const signin = async (req,res,next)=>{
    try{
        const user = await User.findOne({name: req.body.name})
        if(!user) return next(createError(404,"User Not Found"))
        const isCorrect = await bcrypt.compare(req.body.password,user.password)
        if(!isCorrect) return next(createError(400,"Invalid Credentials"))
        
        const token = jwt.sign({id:user._id},process.env.JWT_SECRETKEY)

        const {password, ...others} = user._doc

        res.cookie("access_token", token,{
            httpOnly:true,
            maxAge: 365 * 24 * 60 * 60 * 1000,
            secure: true,
            sameSite:'None'
           })
        .status(200)
        .json(others)
    }catch(err){
        next(err);
    }
}

const generateCode = (length = 6) => {
    let code = '';
    for (let i = 0; i < length; i++) {
        code += Math.floor(Math.random() * 10); // Digits 0-9
    }
    return code;
};

export const getCode = async (req,res,next)=>{
    let code = generateCode()
    try{
        await mailGenerator(req.body.email,req.body.name,code);
        res.status(200).json({code})
    }catch(err){
        console.log("err");
        next(createError(404,"Enter Valid Email"))
    }
}
