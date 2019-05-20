const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    user: { // the relation Post => User
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        tipe: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    }]
})