import jwt from 'jsonwebtoken'
import { createError } from './error.js'

export const verifyToken = (req,res,next)=>{
    const token = req.cookies.access_token
    if(!token) return next(createError(402,"You Are Not Authenticated"))
    jwt.verify(token,process.env.JWT_SECRETKEY,(err,user)=>{
        if(err) return next(createError(403,"Token Is Not Valid!!"))
        req.user = user;
        next()
    })
}