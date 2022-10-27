const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const router = require("express").Router();
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient.model.js");

router.get("/appointments", isAuthenticated, (req, res, next) => {
  let search = { therapist: req.payload._id };
  if (req.payload.role === "secretary") search = {};

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

router.post("/appointments", isAuthenticated, (req, res, next) => {
  const newAppointment = {
    date: req.body.date,
    therapist: req.body.therapistId,
    patient: req.body.patientId,
    isPaid: req.body.isPaid,
    recurring: req.body.recurring,
    notes: req.body.notes,
  };
  Appointment.create(newAppointment)
    .then((response) => res.json(response))
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

router.put(
  "/appointments/:appointmentId",
  isAuthenticated,
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
