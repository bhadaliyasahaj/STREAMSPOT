import mongoose from "mongoose";
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedUsers: {
      type:[String],
    },
    history: {
      type: [String],
    },
  },
  { timestamps: true },
);

UserSchema.methods.createAccessToken=function(){
  const payload = {id:this._id,username:this.name};
  const option = {expiresIn:"1d"}

  const accesstoken = JWT.sign(payload,process.env.ACCESS_SECRETKEY,option)
  return accesstoken
}

UserSchema.methods.createRefreshToken=function(){
  const payload = {id:this._id};
  const option = {expiresIn:"2d"}

  const refreshtoken = JWT.sign(payload,process.env.REFRESH_SECRETKEY,option)
  return refreshtoken
}
export default mongoose.model("User", UserSchema);
