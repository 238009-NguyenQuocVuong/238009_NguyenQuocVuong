import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    gender: 'Nam',
    dateOfBirth: '',
    department: 'CNTT',
    position: 'Nhân viên',
    email: '',
    phone: '',
    hireDate: '',
    status: 'Ðang làm vi?c'
  });
  const [editingId, setEditingId] = useState(null);

  const fetchEmployees = async (keyword = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}?search=${keyword}`);
      setEmployees(res.data);
    } catch (err) {
      console.error('L?i l?y danh sách nhân viên:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(search);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, formData);
        alert('C?p nh?t thành công!');
      } else {
        await axios.post(API_BASE_URL, formData);
        alert('Thêm m?i thành công!');
      }
      resetForm();
      fetchEmployees(search);
    } catch (err) {
      alert(err.response?.data?.message || 'Có l?i x?y ra');
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setFormData(emp);
  };

  const handleDelete = async (id) => {
    if (window.confirm('B?n có ch?c ch?n mu?n xóa nhân viên này?')) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        fetchEmployees(search);
      } catch (err) {
        alert('L?i khi xóa nhân viên');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      employeeId: '',
      fullName: '',
      gender: 'Nam',
      dateOfBirth: '',
      department: 'CNTT',
      position: 'Nhân viên',
      email: '',
      phone: '',
      hireDate: '',
      status: 'Ðang làm vi?c'
    });
  };

  return (
    <div className="container py-4">
      <header className="pb-3 mb-4 border-bottom d-flex justify-content-between align-items-center">
        <div>
          <h2 className="text-primary fw-bold">H? TH?NG QU?N LÝ NHÂN S? (HRM)</h2>
          <p className="text-muted mb-0">Sinh viên: <strong>Nguy?n Qu?c Vuong</strong> | MSSV: <strong>238009</strong></p>
        </div>
      </header>

      <div className="row g-4">
        {/* FORM THÊM / S?A */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white fw-bold">
              {editingId ? 'C?P NH?T NHÂN VIÊN' : 'THÊM NHÂN VIÊN M?I'}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="form-label">Mã Nhân Viên *</label>
                  <input type="text" className="form-control" name="employeeId" value={formData.employeeId} onChange={handleChange} required disabled={!!editingId} />
                </div>
                <div className="mb-2">
                  <label className="form-label">H? và Tên *</label>
                  <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className="row mb-2">
                  <div className="col">
                    <label className="form-label">Gi?i tính</label>
                    <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="Nam">Nam</option>
                      <option value="N?">N?</option>
                    </select>
                  </div>
                  <div className="col">
                    <label className="form-label">Phòng ban</label>
                    <input type="text" className="form-control" name="department" value={formData.department} onChange={handleChange} required />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="form-label">Ch?c v?</label>
                  <input type="text" className="form-control" name="position" value={formData.position} onChange={handleChange} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">S? di?n tho?i</label>
                  <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tr?ng thái</label>
                  <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                    <option value="Ðang làm vi?c">Ðang làm vi?c</option>
                    <option value="Ngh? phép">Ngh? phép</option>
                    <option value="Ðã ngh? vi?c">Ðã ngh? vi?c</option>
                  </select>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary flex-grow-1">
                    {editingId ? 'C?p Nh?t' : 'Thêm M?i'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      H?y
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* DANH SÁCH & TÌM KI?M */}
        <div className="col-lg-8">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <form onSubmit={handleSearch} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm ki?m theo Mã NV ho?c H? tên..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-outline-primary">Tìm ki?m</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => { setSearch(''); fetchEmployees(''); }}>T?i l?i</button>
              </form>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white fw-bold">DANH SÁCH NHÂN VIÊN</div>
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Mã NV</th>
                    <th>H? Tên</th>
                    <th>Phòng Ban</th>
                    <th>Ch?c V?</th>
                    <th>Email</th>
                    <th>Tr?ng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="text-center py-3">Ðang t?i...</td></tr>
                  ) : employees.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-3 text-muted">Không tìm th?y d? li?u nhân viên</td></tr>
                  ) : (
                    employees.map((emp) => (
                      <tr key={emp._id}>
                        <td><strong>{emp.employeeId}</strong></td>
                        <td>{emp.fullName}</td>
                        <td>{emp.department}</td>
                        <td>{emp.position}</td>
                        <td>{emp.email}</td>
                        <td>
                          <span className={`badge ${emp.status === 'Ðang làm vi?c' ? 'bg-success' : emp.status === 'Ngh? phép' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-warning me-1" onClick={() => handleEdit(emp)}>S?a</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(emp._id)}>Xóa</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
