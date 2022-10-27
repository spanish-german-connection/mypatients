const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const { roles } = require("../models/User.model.js");

const router = require("express").Router();
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");

// GET ALL THE APPOINTMENTS
router.get("/appointments", isAuthenticated, (req, res, next) => {
  let search = { therapist: req.payload._id };
  if (req.payload.role === roles.secretary) search = {};

  Appointment.find(search)
    .populate("patient")
    .populate("therapist")
    .then((allAppointments) => res.json(allAppointments))
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// CREATE NEW APPOINTMENT
router.post("/appointments", isAuthenticated, (req, res, next) => {
  Appointment.create(req.body)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get(
  "/appointments/:appointmentId",
  isAuthenticated,
  (req, res, next) => {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Appointment.findById(appointmentId)
      .populate("patient")
      .then((appointment) => res.status(200).json(appointment))
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
);

router.put(
  "/appointments/:appointmentId",
  isAuthenticated,
  (req, res, next) => {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Appointment.findByIdAndUpdate(appointmentId, req.body, { new: true })
      .then((updatedAppointment) => res.json(updatedAppointment))
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
);

router.delete(
  "/appointments/:appointmentId",
  isAuthenticated,
  (req, res, next) => {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Appointment.findByIdAndDelete(appointmentId)
      .then(() =>
        res.json({
          message: `Appointment with ${appointmentId} is removed successfully.`,
        })
      )
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
);

module.exports = router;
