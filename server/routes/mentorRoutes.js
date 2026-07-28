const express = require("express");
const router = express.Router();
const {
  getAllMentors,
  matchMentors,
  registerMentor,
} = require("../controllers/mentorController");

router.post("/match", matchMentors);
router.post("/register", registerMentor);
router.get("/", getAllMentors);

module.exports = router;