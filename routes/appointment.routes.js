const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const router = require("express").Router();
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient.model.js");
const {
  isAppointOwner,
} = require("../middleware/isAppointOwner.middleware.js");

// GET /api/appointments  -  Get list of appointments
router.get("/appointments", isAuthenticated, (req, res, next) => {
  Appointment.find({ therapist: req.payload._id })
    .populate("patient")
    .populate("therapist")
    .then((allAppointments) => res.json(allAppointments))
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// GET /api/appointments/:appointmentId -  Retrieves a specific appointment by id
router.get(
  "/appointments/:appointmentId",
  isAuthenticated,
  isAppointOwner,
  (req, res, next) => {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Appointment.findById(appointmentId)
      .populate("therapist")
      .populate("patient")
      .then((appointment) => res.status(200).json(appointment))
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
);

// POST /api/appointments  -  Creates a new appointments
router.post("/appointments", isAuthenticated, (req, res, next) => {
  const { date, patient, isPaid, recurring, notes } = req.body;

  const therapist = req.payload._id;
  const newAppointment = {
    date,
    patient,
    isPaid,
    recurring,
    notes,
    therapist,
  };
  Appointment.create(newAppointment)
    .then((response) => res.json(response))
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// PUT  /api/appointments/:appointmentId  -  Updates a specific appointment by id
router.put(
  "/appointments/:appointmentId",
  isAuthenticated,
  isAppointOwner,
  (req, res, next) => {
    const { appointmentId } = req.params;

    const updatedAppointment = {
      date: req.body.date,
      isPaid: req.body.isPaid,
      recurring: req.body.recurring,
      notes: req.body.notes,
    };

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Appointment.findByIdAndUpdate(appointmentId, updatedAppointment, {
      new: true,
    })
      .then((updatedAppointment) => res.json(updatedAppointment))
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
);

// DELETE  /api/appointments/:appointmentId  -  Deletes a specific appointment by id
router.delete(
  "/appointments/:appointmentId",
  isAuthenticated,
  isAppointOwner,
  (req, res, next) => {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Appointment.findByIdAndDelete(appointmentId)
      .then(() => {
        res.json({
          message: `Appointment with ${appointmentId} is removed successfully.`,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
);

module.exports = router;
