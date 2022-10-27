const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    role: {
      type: String,
      enum: ["therapist", "secretary", "admin"],
      lowercase: true,
      default: "therapist",
    },
    patients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Patient",
        default: "No patients yet",
      },
    ],
    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
        default: "No appointments yet",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
        default: "No posts yet",
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
