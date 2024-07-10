import mongoose, { Schema } from 'mongoose'
const schema = new Schema({
    title: String,
    description: String,
    status: {
        type: String,
        required: true,
        trim: true,
        enum: ['toDo', 'doing', 'done'],
        default: 'toDo'
    },
    userID: { // the own who will assign the task
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    assignedTo: { // the one who will be assigned the task 
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    deadLine: {
        type: Date
    }
}, {
    timestamps: true
})

export const taskModel = mongoose.model('task', schema)