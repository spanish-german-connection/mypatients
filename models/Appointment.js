const { Schema, model } = require("mongoose");

const appointmentSchema = new Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required."],
    },
    // startdate: {
    //   type: Date,
    //   required: [true, "Start date is required."],
    // },
    // enddate: {
    //   type: Date,
    //   required: [true, "End date is required."],
    // },
    isPaid: {
      type: Boolean,
      default: false,
    },
    recurring: {
      type: String,
      enum: ["none", "weekly", "biweekly"],
    },
    notes: {
      type: String,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
    therapist: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Appointment = model("Appointment", appointmentSchema);

module.exports = Appointment;
