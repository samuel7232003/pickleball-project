const express = require("express");
const router = express.Router();
const { getStatistics } = require("../controllers/statisticsController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Protect all routes after this middleware
router.use(protect);
router.use(restrictTo("OWNER", "ADMIN"));

router.get("/", getStatistics);

module.exports = router;
