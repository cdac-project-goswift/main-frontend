import { useState, useEffect } from "react";
import adminService from "../../services/admin.service";
import api from "../../services/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await adminService.getAllUsers();
      console.log("Users response:", res);
      setUsers(res?.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
      alert("Error loading users: " + (err.response?.data?.message || err.message));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (user) => {
    const newStatus = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    if (window.confirm(`Set ${user.firstName} to ${newStatus}?`)) {
      try {
        await api.put(`/admin/users/${user.userId}/status`, null, { params: { status: newStatus } });
        loadUsers();
      } catch (err) {
        alert("Failed to update status");
      }
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>Manage Users</h2>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.length > 0 ? users.map((u) => (
              <tr key={u.userId}>
                <td>{u.userId}</td>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                {/* Fix: Safety check for role string */}
                <td>{u.role ? u.role.replace('ROLE_', '') : ''}</td>
                <td>
                  <span style={{ color: u.status === 'ACTIVE' ? 'green' : 'red', fontWeight: 'bold' }}>
                    {u.status}
                  </span>
                </td>
                <td>
                  {u.role !== 'ROLE_ADMIN' && (
                    <button 
                      className={`btn ${u.status === 'ACTIVE' ? 'btn-danger' : 'btn-primary'}`}
                      onClick={() => toggleStatus(u)}
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      {u.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                    </button>
                  )}
                </td>
              </tr>
            )) : <tr><td colSpan="6">No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;