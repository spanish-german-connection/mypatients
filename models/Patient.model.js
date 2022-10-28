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
    medications: [
      {
        type: String,
        default: "No medications yet",
      },
    ],
    diagnoses: [
      {
        type: String,
        required: true,
        default: "No diagnoses yet",
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Patient = model("Patient", patientSchema);

module.exports = Patient;
