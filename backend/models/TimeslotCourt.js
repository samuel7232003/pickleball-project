const mongoose = require('mongoose')

const timeslotCourtSchema = mongoose.Schema({
  _id: String,
  court_id: String,
  start_time: String,
  end_time: String,
  status: Number,
  price: Number,
})

const timeslotCourtModel = mongoose.model('TimeslotCourt', timeslotCourtSchema);
module.exports = timeslotCourtModel;