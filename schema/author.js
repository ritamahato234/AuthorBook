const mongoose = require('mongoose');  //require mongoose package
//authorschema collection
var authorSchema = new mongoose.Schema({
  Name: { type: String,trim: true, required: true },
  Description: { type: String, required: true },
  Country: { type: String, required: true}
}, {
  timestamps: true
});


module.exports = mongoose.model("Author", authorSchema);