const express = require("express");
const router = express.Router();
const {
  getAllSkillCourses,
  matchSkillCourses,
} = require("../controllers/skillController");

router.post("/match", matchSkillCourses);
router.get("/", getAllSkillCourses);

module.exports = router;