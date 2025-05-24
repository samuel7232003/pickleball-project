const mongoose = require('mongoose');

const imageCourtSchema = mongoose.Schema({
  url: String,
  order: Number,
  courtId: String,
});

const imageCourtModel = mongoose.model('ImageCourt', imageCourtSchema);

module.exports = imageCourtModel;