const express = require('express');
//const upload = require('../Middleware/multer'); // same multer used for uploads
const { markAttendance } = require('../Controllers/AttendanceController');

const router = express.Router();

router.post('/mark', markAttendance);
// router.post('/mark', upload.single('image'), markAttendance);

module.exports = router;
