import mongoose from "mongoose";

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
        playlist:{
            type:[String]
        }
    },{timestamps:true}
)

export default mongoose.model("Playlists",PlaylistSchema)