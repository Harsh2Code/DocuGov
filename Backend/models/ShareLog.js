import mongoose from 'mongoose';

const ShareLogSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true,
    },
    sharerUID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    signedUrl: {
        type: String,
        required: true,
    },
    expirationTime: {
        type: Date,
        required: true,
    },
    accessCount: {
        type: Number,
        default: 0,
    },
    maxAccess: {
        type: Number,
        default: 1,
    },
    shareData: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('ShareLog', ShareLogSchema);