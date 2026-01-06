
import path from 'path';
import fs from 'fs';
import Add_Employee from "../models/addcandidate.model.js";

export const createForm = async (req, res) => {
  try {
    const { name, gender, dateOfBirth, state, status } = req.body;
    const image = req.file ? req.file.filename : null;  // ✅ Filename only

    const newEmployee = new Add_Employee({
      name, gender, dateOfBirth, state, status, image
    });

    await newEmployee.save();
    res.status(201).json({ status: "Success", data: newEmployee });
  } catch (error) {
    console.error('❌ Create:', error);
    res.status(500).json({ status: "Error", message: error.message });
  }
};

export const getAllForms = async (req, res) => {
  try {
    const employees = await Add_Employee.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "Success", data: employees });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Add_Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Not found" });

    if (employee.image) {
      const imagePath = path.join('uploads', employee.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Add_Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchEmployee = async (req, res) => {
  try {
    const { gender, status } = req.query;
    const filter = {};
    if (gender) filter.gender = gender;
    if (status) filter.status = status;

    const employees = await Add_Employee.find(filter);
    res.status(200).json({ status: "success", data: employees });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existingEmployee = await Add_Employee.findById(id);
    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Delete old image
    if (req.file && existingEmployee.image) {
      const oldImagePath = path.join('uploads', existingEmployee.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    updates.image = req.file ? req.file.filename : existingEmployee.image;

    const updatedEmployee = await Add_Employee.findByIdAndUpdate(
      id, updates,
      { new: true, runValidators: true }
    );

    res.json({ message: "Updated successfully", data: updatedEmployee });
  } catch (error) {
    console.error('❌ Update:', error);
    res.status(500).json({ error: error.message });
  }
};



export const getdatabyName = async (req, res) => {
  try {
    const record = await Add_Employee.findOne({ name: req.params.name });
    if (!record) {
      return res.status(404).json({ message: "No record found" });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};