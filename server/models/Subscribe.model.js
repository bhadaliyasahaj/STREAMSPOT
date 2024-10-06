import mongoose from 'mongoose'

const SubscriberSchema = mongoose.Schema({
    subscribedFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: false
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
}, { timestamps: true })

SubscriberSchema.index({ subscribedFrom: 1, subscribedTo: 1 }, { unique: true })

export default mongoose.model('subscriber', SubscriberSchema)