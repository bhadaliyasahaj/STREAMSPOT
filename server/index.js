import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'


const app = express()

dotenv.config()

const connect = ()=>{
    mongoose
       .connect(process.env.MONGO_URI)
       .then(()=> console.log('Connected to MongoDB'))
       .catch(err => {throw err})
}

app.listen(process.env.PORT,()=>{
    connect();
    console.log(`Server is running on port ${process.env.PORT}`)
})