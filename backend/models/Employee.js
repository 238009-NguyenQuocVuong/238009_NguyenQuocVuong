const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  gender: { type: String, default: 'Nam' },
  dateOfBirth: { type: String },
  department: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  hireDate: { type: String },
  status: { type: String, default: 'Ðang làm vi?c' }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
