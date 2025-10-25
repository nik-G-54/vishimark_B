// const mongoose = require('mongoose');

// const AttendanceSchema = new mongoose.Schema({
//       _id: {
//     type: String,          // student id like "101"
//     required: true
//   },
//     username: {
//     type: String,
//     required: true
//   },
//     image_path: {
//     type: String,          // path or Cloudinary URL of stored image
//     required: true
//   },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
//     date: { type: String, required: true },
//     time: { type: String, required: true },
//     status: { type: String, default: 'Present' }
//       registeredAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('attendance', AttendanceSchema);
const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: String,          // reference to user._id
    required: true
  },
  username: {
    type: String,
    required: true
  },
  date: {
    type: String,          // "YYYY-MM-DD"
    required: true
  },
  time: {
    type: String,          // "HH:mm:ss"
    required: true
  },
  confidence: {
    type: Number,          // similarity score from ML model
    required: true
  }
});

module.exports = mongoose.model("attendance", AttendanceSchema);

