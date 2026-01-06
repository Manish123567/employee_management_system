import mongoose from "mongoose";

const addEmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    state: { type: String },
    dateOfBirth: { type: Date },
    image: { type: String },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Inactive",
    },

  },
  { timestamps: true }
);



const Add_Employee = mongoose.model("add_employee", addEmployeeSchema);

export default Add_Employee;
