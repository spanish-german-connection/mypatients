const Patient = require("../models/Patient.model");

const isPatientOwner = () => {
  const { patientId } = req.params;

  Patient.findById(patientId).then((patient) => {
    if (patient.therapist === req.payload._id) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized to manage this patient" });
    }
  });
};

// Export the middleware so that we can use it to create protected routes
module.exports = { isPatientOwner };
