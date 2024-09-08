import User from '../models/User.model.js'
import bcrypt from 'bcrypt'
import { createError } from '../error.js'
import { mailGenerator } from '../utils/emailGenerator.js'
import crypto from 'crypto'

export const signup = async (req, res, next) => {
    try {
        const hashPass = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({ ...req.body, password: hashPass })
        await newUser.save();
        res.status(200).send("User Has Been Created")
    } catch (err) {
        if (err.errorResponse.keyPattern.email === 1) {
            next(createError(404, "Email Already Exist"));
        } else if (err.errorResponse.keyPattern.name === 1) {
            next(createError(402, "Username Already Exist"))
        } else {
            next(err)
        }
    }
}

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ name: req.body.name })
        if (!user) return next(createError(404, "User Not Found"))
        const isCorrect = await bcrypt.compare(req.body.password, user.password)
        if (!isCorrect) return next(createError(400, "Invalid Credentials"))

        const Access_Token = user.createAccessToken()
        const Refresh_Token = user.createRefreshToken()



        // const token = jwt.sign({id:user._id},process.env.JWT_SECRETKEY,{expiresIn:60})

        const { password, ...others } = user._doc

        res
            .cookie("access_token", Access_Token, {
                httpOnly: true,
                maxAge: 365 * 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: 'None'
            })
            .cookie("refresh_token", Refresh_Token, {
                httpOnly: true,
                maxAge: 365 * 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: 'None'
            })
            .status(200)
            .json(others)
    } catch (err) {
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

export const getCode = async (req, res, next) => {
    let code = generateCode()
    try {
        await mailGenerator(req.body.email, req.body.name, code, null);
        res.status(200).json({ code })
    } catch (err) {
        console.log("err");
        next(createError(404, "Enter Valid Email"))
    }
}

export const handleForgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email })

        if (user.length === 0) {
            return next(createError(402, "User Not Found"))
        }

        const token = crypto.randomBytes(32).toString('hex')

        await User.findByIdAndUpdate(user._id, {
            resetToken: token,
            resetTokenExpiry: Date.now() + 360000,
        })

        console.log(user);


        const resetLink = `${process.env.CLIENT_URL}/#/reset-password?token=${token}&email=${email}`;

        await mailGenerator(email, user.name, null, resetLink)

        res.status(200).json("Reset Email Sended")

        // console.log(user);


    } catch (err) {
        console.log(err);
    }
}

export const handleResetPassword = async (req, res, next) => {
    try {
        const { email, token, newpassword } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return next(createError(402, "User Not Found"))
        }
        if (user.resetTokenExpiry < Date.now()) {
            return next(createError(403, "Token Expired Generate New"))
        }
        if (user.resetToken !== token) {
            return next(createError(404, "Token Is Not Valid"))
        }

        const hashedpass = await bcrypt.hash(newpassword,10)
        await User.findByIdAndUpdate(user._id,{
            password:hashedpass,
            resetToken:null,
            resetTokenExpiry:null,
        })

        res.status(200).json("Password Changed Successfully")


    } catch (error) {
        console.log(error);
    }
}
