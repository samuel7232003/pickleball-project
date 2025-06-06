const mongoose = require('mongoose')

const courtSchema = mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number,
  location: String,
  number: Number,
  description: String,
  ownerId: String,
})

const courtModel = mongoose.model('Court', courtSchema);
module.exports = courtModel;