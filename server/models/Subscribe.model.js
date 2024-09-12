import mongoose from 'mongoose'

const SubscriberSchema = mongoose.Schema({
    subscribedFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subscribedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now()
    }
},{timestamps:true})

export default mongoose.model('subscriber',SubscriberSchema)