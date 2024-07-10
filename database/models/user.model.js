import mongoose, { Schema } from "mongoose";
import mongooseDelete from "mongoose-delete"; // this is a required module (plug-in)

const schema = new Schema({
    userName: {
        type: String,
        trim: true,
        lowercase: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'MALE', 'FEMALE', 'not specified'],
        default: 'not specified'
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    isOnline: Boolean,
    isConfirmed: Boolean,
    profilePicture: {
        secure_url: String,
        public_id: String
    },
    coverPictures: [
        {
            secure_url: String,
            public_id: String
        }
    ]
}, {
    timestamps: true
})
schema.plugin(mongooseDelete) // this plugs in the mongoose delete plugin that allows soft delete

export const userModel = mongoose.model('user', schema)