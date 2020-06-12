const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const articleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    subtitle: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;