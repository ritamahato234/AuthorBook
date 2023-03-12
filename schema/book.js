const mongoose = require('mongoose'); //require mongoose
//bookschema collection 
var bookSchema = new mongoose.Schema({
  Name: { type: String,trim: true, required: true },
  Image: {type: String, default: ''},
  Description: { type: String, required: true },
  Author: { type: mongoose.Schema.ObjectId,ref:"Author", required: true},
  Price: { type: Number, required: true }
}, {
  timestamps: true
});


module.exports = mongoose.model("Book", bookSchema);

