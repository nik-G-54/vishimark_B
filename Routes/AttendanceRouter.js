const express = require("express");
const router = express.Router();
const { markAttendance, getUserAttendance } = require("../Controllers/AttendanceController");
const { verifyToken } = require("../Middleware/authMiddleware");

router.post("/mark", verifyToken, markAttendance);
router.get("/user", verifyToken, getUserAttendance);

module.exports = router;

