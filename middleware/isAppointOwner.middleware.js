const Appointment = require("../models/Appointment");

const isAppointOwner = (req, res, next) => {
  const { appointmentId } = req.params;

  Appointment.findById(appointmentId).then((appointment) => {
    if (String(appointment.therapist) === req.payload._id) {
      next();
    } else {
      res
        .status(401)
        .json({ message: "Unauthorized to manage this appointment" });
    }
  });
};

// Export the middleware so that we can use it to create protected routes
module.exports = { isAppointOwner };
