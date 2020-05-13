'use strict'

var mongoose = require('mongoose');
var paginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var CommentSchema = Schema({
    content: String,
    date: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
});

var StyleSchema = Schema({
    title: String,
    content: String,
    image: String,
    date: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' },
    comments: [CommentSchema]
});

// LOAD PAGINATION
StyleSchema.plugin(paginate);

module.exports = mongoose.model('Style', StyleSchema);