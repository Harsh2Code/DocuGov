import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
    userRaf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    docType: {
        type: String,
        required: true,
        trim: true,
    },
    storagePath: {
        type: String,
        required: true,
        unique: true,
    },
    identifier: {
        type: String,
        required: false,
    },
    uploadData: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.model('Document', DocumentSchema);