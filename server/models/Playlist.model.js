import mongoose, { set } from "mongoose";

const PlaylistSchema = new mongoose.Schema(
    {
        userId:{
            type:String,
            required:true,
        },
        name:{
            type:String,
            required:true,
        },
        type:{
            type:String,
            required:true,
            set:(value)=>value.toUpperCase()
        },
        playlist:{
            type:[String]
        }
    },{timestamps:true}
)

export default mongoose.model("Playlists",PlaylistSchema)