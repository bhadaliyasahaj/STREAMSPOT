import express from 'express'
import { signin } from '../controllers/auth.controller.js'
import { signup } from '../controllers/auth.controller.js'

const router = express.Router()

//Create a User
router.post("/signup", signup)

//Sign In
router.post("/signin",signin)

export default router