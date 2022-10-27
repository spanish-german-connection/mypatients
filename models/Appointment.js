const { Schema, model } = require("mongoose");

const appointmentSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
    therapist: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isPaid: {
      type: Boolean,
    },
    recurring: {
      type: String,
      enum: ["none", "weekly", "biweekly"],
    },
    notes: {
      type: String,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Appointment = model("Appointment", appointmentSchema);

module.exports = Appointment;
