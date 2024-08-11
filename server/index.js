import express from 'express'
import { connectDB } from './db/index.js'
import dotenv from 'dotenv'
import userRoutes from './routes/users.js'
import videoRoutes from './routes/videos.js'
import commentRoutes from './routes/comments.js'
import authRoutes from './routes/auth.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'


const app = express()

const corsOptions = {
    origin:process.env.CLIENT_URL, // Set your frontend URL
    credentials: true, // Allow credentials (cookies, etc.) to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
};
app.use(cookieParser())
app.use(express.json())
app.use(cors(corsOptions))


app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/videos", videoRoutes)
app.use("/api/comments", commentRoutes)


app.use((err,req,res,next)=>{
    const status = err.status || 500;
    const message = err.message || "Something Went Wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    })
})

app.listen(process.env.PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${process.env.PORT}`)
})