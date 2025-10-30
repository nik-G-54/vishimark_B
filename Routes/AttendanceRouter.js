const express = require("express");
const upload = require("../Middleware/multer");
const router = express.Router();
const { markAttendance, getUserAttendance } = require("../Controllers/AttendanceController");
const { verifyToken } = require("../Middleware/authMiddleware");

router.post("/mark", verifyToken,upload.single("file"), markAttendance);
router.get("/user", verifyToken, getUserAttendance);

module.exports = router;

