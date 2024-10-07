import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            set: (value) => value.toUpperCase()
        },
        playlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Video'
            }
        ]
    }, { timestamps: true }
)

export default mongoose.model("Playlists", PlaylistSchema)