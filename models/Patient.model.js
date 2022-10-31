const { Schema, model } = require("mongoose");

const patientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    surname: {
      type: String,
      required: [true, "Surname is required."],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "The date of birth is required."],
      min: ['1920-10-01', 'Minimum date of birth is 1920-10-01'],
      max: ['2022-10-01', 'Maximum date of birth is 2022-10-01']
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required."],
      unique: true,
      trim: true,
    },
    therapist: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    diagnoses: {
      type: String,
      required: [true, "A diagnose is required."],
      default: "No diagnoses yet",
    },
    medications:
    {
      type: String,
      default: "No medications yet",
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Patient = model("Patient", patientSchema);

module.exports = Patient;
