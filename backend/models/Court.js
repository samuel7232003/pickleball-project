const mongoose = require('mongoose')

const courtSchema = mongoose.Schema({
  _id: String,
  name: String,
  lat: Number,
  lng: Number,
  address: String,
  description: String,
  owner_id: String,
})

const courtModel = mongoose.model('Court', courtSchema);
module.exports = courtModel;