const Patient = require("../models/Patient.model");

const isPatientOwner = (req, res, next) => {
  const { patientId } = req.params;
i
  Patient.findById(patientId).then((patient) => {
    
    if (String(patient.therapist) === req.payload._id) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized to manage this patient" });
    }
  });
};

// Export the middleware so that we can use it to create protected routes
module.exports = { isPatientOwner };
