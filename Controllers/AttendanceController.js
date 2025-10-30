// const axios = require('axios');
// const fs = require('fs');
// const FormData = require('form-data');
// const AttendanceModel = require('../Models/Attendance');
// const UserModel = require('../Models/User');

// const markAttendance = async (req, res) => {
//     try {
//         console.log('📸 Received image for verification');
//         console.log('req.file:', req.file);

//        // Send image to ML service for verification
//         const form = new FormData();
//         form.append('file', fs.createReadStream(req.file.path));

//         const mlResponse = await axios.post('http://localhost:5001/verify-face', form, {
//             headers: form.getHeaders(),
//         });

//         console.log(' ML Service Response:', mlResponse.data);

//         const { matched, userId, confidence } = mlResponse.data;

//         if (!matched) {
//             return res.status(400).json({ message: 'Face not recognized', success: false });
//         }

//         // Step 2️⃣ Check if already marked
//         const now = new Date();
//         const date = now.toISOString().split('T')[0];
//         const time = now.toTimeString().split(' ')[0];

//         const existing = await AttendanceModel.findOne({ userId, date });
//         if (existing) {
//             return res.status(400).json({ message: 'Attendance already marked today', success: false });
//         }

//         // Step 3️⃣ Mark attendance
//         const attendance = new AttendanceModel({ userId, date, time, status: 'Present' });
//         await attendance.save();

//         res.status(201).json({
//             message: 'Attendance marked successfully',
//             success: true,
//             data: { userId, confidence, date, time },
//         });

//     } catch (err) {
//         console.error('❌ Error in markAttendance:', err);
//         res.status(500).json({ message: 'Internal server error', success: false });
//     }
// };

// module.exports = { markAttendance };



// yha se chlne wala code hai......
// const fs = require('fs');
// const FormData = require('form-data');
// const AttendanceModel = require('../Models/Attendance');

// // Safe markAttendance function
// const markAttendance = async (req, res) => {
//   try {
//     console.log('📸 Received image for verification');
//     console.log('req.file:', req.file);

//     // 1️⃣ Check if an image was uploaded
//     if (!req.file) {
//       return res.status(400).json({ message: 'No image uploaded', success: false });
//     }

//     // 2️⃣ Mock ML service response for testing
//     // Replace this with actual axios call once ML is ready
//     const mockMLResponse = {
//       matched: true,
//       userId: req.body.userId || '123456', // get from frontend temporarily
//       confidence: 0.99
//     };

//     console.log('✅ Mock ML Response:', mockMLResponse);

//     const { matched, userId, confidence } = mockMLResponse;

//     if (!matched) {
//       return res.status(400).json({ message: 'Face not recognized', success: false });
//     }

//     // 3️⃣ Prevent duplicate attendance for today
//     const now = new Date();
//     const date = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
//     const time = now.toTimeString().split(' ')[0]; // "HH:MM:SS"

//     const existing = await AttendanceModel.findOne({ userId, date });
//     if (existing) {
//       return res.status(400).json({ message: 'Attendance already marked today', success: false });
//     }

//     // 4️⃣ Save attendance
//     const attendance = new AttendanceModel({
//       userId,
//       date,
//       time,
//       status: 'Present'
//     });
//     await attendance.save();

//     // 5️⃣ Cleanup temporary file
//     fs.unlink(req.file.path, (err) => {
//       if (err) console.warn('⚠️ Failed to delete temp file:', err.message);
//     });

//     res.status(201).json({
//       message: 'Attendance marked successfully',
//       success: true,
//       data: { userId, confidence, date, time },
//     });

//   } catch (err) {
//     console.error('❌ Error in markAttendance:', err.message);
//     res.status(500).json({ message: 'Internal server error', success: false });
//   }
// };

// module.exports = { markAttendance };



/////



// const axios = require("axios");
// const AttendanceModel = require("../Models/Attendance");

// /**
//  * POST /attendance/mark
//  * Body: { image: "data:image/jpeg;base64,..." }
//  * Calls Flask ML API for verification and saves attendance in MongoDB.
//  */
// const markAttendance = async (req, res) => {
//   try {
//     console.log("📸 Received request for face verification");

//     const { image } = req.body;
//     if (!image) {
//       return res.status(400).json({ success: false, message: "No image provided" });
//     }

//     const flaskURL = process.env.FLASK_URL || "http://127.0.0.1:5000/api/verify";
//      console.log("🔁 Sending image to Flask:", flaskURL);

//     const flaskResponse = await axios.post(flaskURL, { image }, {
//       timeout: 10000,
//       headers: {
//         "Content-Type": "application/json",
//         ...(process.env.ML_API_KEY ? { "x-api-key": process.env.ML_API_KEY } : {})
//       }
//     });

//     const result = flaskResponse.data;
//     console.log("✅ Flask Response:", result);

//     if (!result || !result.recognized || result.recognized.length === 0) {
//       return res.status(400).json({ success: false, message: "Face not recognized" });
//     }

//     const match = result.recognized.find(r => r.matched);
//     if (!match) {
//       return res.status(400).json({ success: false, message: "No valid match found" });
//     }


// // const result = {
// //   recognized: [{ matched: true, userId: "101", username: "Aviral", confidence: 0.95 }]
// // };

//     const { userId, username, confidence } = match;

//     const now = new Date();
//     const date = now.toISOString().split("T")[0];
//     const time = now.toTimeString().split(" ")[0];

//     const existing = await AttendanceModel.findOne({ userId, date });
//     if (existing) {
//       return res.status(400).json({
//         success: false,
//         message: "Attendance already marked today",
//         data: { userId, username, date }
//       });
//     }

//     const attendance = new AttendanceModel({
//       userId,
//       username,
//       date,
//       time,
//       confidence,
//       status: "Present"
//     });
//     await attendance.save();

//     return res.status(201).json({
//       success: true,
//       message: "Attendance marked successfully",
//       data: { userId, username, confidence, date, time }
//     });

//   } catch (err) {
//     console.error("❌ Error in markAttendance:", err.message);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// module.exports = { markAttendance };

const fs = require("fs");
const axios = require("axios");
const AttendanceModel = require("../Models/Attendance");

const markAttendance = async (req, res) => {
  try {
    // let imageBase64 = "";
// const formData= await req.formData();
// console.log(formData, "🚀 formData received in markAttendance");
//     const FormData = formData.getAll(file);
//     console.log(FormData, "🚀 FormData received in markAttendance");
   // console.log(req.file, "🚀 req.file received in markAttendance");

    // if (req.file) {
    //   imageBase64 = "data:image/jpeg;base64," + req.file.buffer.toString("base64");
    // } else if (req.body.image) {
    //   imageBase64 = req.body.image;
    // } else {
    //   return res.status(400).json({ success: false, message: "No image provided" });
    // }
    // console.log(imageBase64, "🚀 imageBase64 prepared for Flask");
    
if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required",
            });
        }

        // ✅ Read uploaded file and convert to Base64
        const imageBuffer = fs.readFileSync(req.file.path);
        const imageBase64 = imageBuffer.toString("base64");
  // console.log(imageBase64, "🚀 imageBase64 prepared for Flask");
    const flaskURL = process.env.FLASK_URL || "https://visimarkml-3.onrender.com/api/verify";

    const flaskResponse = await axios.post(
      flaskURL,
      { image: imageBase64 },
      {  headers: { "Content-Type": "application/json" } }
    ).catch(() => {
      throw new Error("Flask API not reachable");
    });

    const result = flaskResponse.data;

    if (!result || !result.recognized || result.recognized.length === 0) {
      return res.status(400).json({ success: false, message: "Face not recognized" });
    }

    const match = result.recognized.find(r => r.matched);
    if (!match) {
      return res.status(400).json({ success: false, message: "No valid match found" });
    }

    const { userId, username, confidence } = match;
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().split(" ")[0];

    const existing = await AttendanceModel.findOne({ userId, date });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked today",
        data: { userId, username, date },
      });
    }

    const attendance = new AttendanceModel({
      userId,
      username,
      date,
      time,
      confidence,
      status: "Present",
    });
    await attendance.save();

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: { userId, username, confidence, date, time },
    });

  } catch (err) {
    console.log("❌ Error in markAttendance:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getUserAttendance = async (req, res) => {
  try {
    const userId = req.user.id; // decoded from JWT middleware
    const attendance = await AttendanceModel.find({ userId }).sort({ date: -1 });
    return res.status(200).json({ success: true, data: attendance });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { markAttendance, getUserAttendance };


