const mongoose = require('mongoose')

const timeslotCourtSchema = mongoose.Schema({
  courtId: String,
  startTime: String,
  endTime: String,
  status: Number,
  price: Number,
})

const timeslotCourtModel = mongoose.model('TimeslotCourt', timeslotCourtSchema);
module.exports = timeslotCourtModel;