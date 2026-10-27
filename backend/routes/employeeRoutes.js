const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET /api/employees - L?y danh sách & Tìm ki?m
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { employeeId: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'L?i máy ch?', error: err.message });
  }
});

// GET /api/employees/:id - Chi ti?t nhân viên
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Không tìm th?y nhân viên' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'L?i máy ch?', error: err.message });
  }
});

// POST /api/employees - Thêm nhân viên m?i
router.post('/', async (req, res) => {
  try {
    const { employeeId, fullName, email } = req.body;
    if (!employeeId || !fullName || !email) {
      return res.status(400).json({ message: 'Mã NV, H? tên và Email là b?t bu?c' });
    }
    const existing = await Employee.findOne({ employeeId });
    if (existing) {
      return res.status(400).json({ message: 'Mã nhân viên dã t?n t?i' });
    }
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: 'D? li?u không h?p l?', error: err.message });
  }
});

// PUT /api/employees/:id - C?p nh?t nhân viên
router.put('/:id', async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm th?y nhân viên' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'C?p nh?t th?t b?i', error: err.message });
  }
});

// DELETE /api/employees/:id - Xóa nhân viên
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm th?y nhân viên' });
    res.json({ message: 'Xóa nhân viên thành công' });
  } catch (err) {
    res.status(500).json({ message: 'L?i máy ch?', error: err.message });
  }
});

module.exports = router;
