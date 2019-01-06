const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * Creating a Comments Schema
 */

const CommentsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post',
        required: true,
    },
    comment: {
        type: String,
        required:true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = Comment = mongoose.model('comments', CommentsSchema)