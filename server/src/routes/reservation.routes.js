const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/auth.middleware");

const {
  listCourts,
  createReservation,
  listReservations,
  cancelReservation,
  getSchedule
} = require("../controllers/reservation.controller");

// Rotas protegidas (necessário token JWT)
router.get("/courts", authenticateJWT, listCourts);
router.post("/reservations", authenticateJWT, createReservation);
router.get("/reservations/:userId", authenticateJWT, listReservations);
router.delete("/reservations/:id", authenticateJWT, cancelReservation);
router.get("/schedule/:courtId/:date", authenticateJWT, getSchedule);


module.exports = router;
