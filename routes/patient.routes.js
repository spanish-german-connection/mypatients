const router = require("express").Router();

const mongoose = require('mongoose');

const Patient = require('../models/Patient.model');

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");


// GET /api/patients  -  Get list of patients
router.get('/patients', (req, res, next) => {
    Patient.find()
        .then(allPatients => {
            res.json(allPatients)
        })
        .catch(err => {
            console.log("error getting list of patients...", err);
            res.status(500).json({
                message: "error getting list of patients",
                error: err
            })
        });
});

// GET /api/patients/:patientId -  Retrieves a specific patient by id
router.get('/patients/:patientId', (req, res, next) => {
    const { patientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    // Each patient document has `appointment` array holding `_id`s of appointment documents
    // We use .populate() method to get swap the `_id`s for the actual appointment documents
    Patient.findById(patientId)
        .populate('appointments')
        .then(patient => res.json(patient))
        .catch(err => {
            console.log("error getting patient details...", err);
            res.status(500).json({
                message: "error getting patient details...",
                error: err
            })
        });
});


// PUT  /api/patients/:patientId  -  Updates a specific patient by id
router.put('/patients/:patientId', isAuthenticated, (req, res, next) => {
    const { patientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Patient.findByIdAndUpdate(patientId, req.body, { new: true })
        .then((updatedPatient) => res.json(updatedPatient))
        .catch(err => {
            console.log("error updating patient...", err);
            res.status(500).json({
                message: "error updating patient...",
                error: err
            })
        });
});


// POST /api/patients  -  Creates a new patient
router.post('/patients', isAuthenticated, (req, res, next) => {
    const { name,
        surname,
        email,
        phone,
        medications,
        diagnostics } = req.body;

    const newPatient = {
        name,
        surname,
        email,
        phone,
        medications,
        diagnostics,
        appointments: []
    };

    Patient.create(newPatient)
        .then(response => res.json(response))
        .catch(err => {
            console.log("error creating a new patient...", err);
            res.status(500).json({
                message: "error creating a new patient",
                error: err
            })
        }
        );
});


module.exports = router;
