const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Double = 0.0;
let BookSchema = new Schema({
    title: String,
    author: String,
    isbn: String,
    price: Double
});

module.exports = mongoose.model('Book', BookSchema);

