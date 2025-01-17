import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String },
  role: { type: String, default: "user", enum: ["user", "doctor", "admin"] },
  extraInfo: {
    fees: { type: Number },
    hospital: { type: String },
    time: { type: String },
    bio: { type: String },
    specialization: { type: String },
    gender: { type: String },
  },
});



export const UserModal =
  mongoose.models?.Users || mongoose.model("Users", userSchema);
