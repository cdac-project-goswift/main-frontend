import { useState, useEffect } from "react";
import agentService from "../../services/agent.service";
import { useAuth } from "../../providers/AuthProvider";

const ManageFleet = () => {
  const { user } = useAuth();
  const [buses, setBuses] = useState([]);
  const [formData, setFormData] = useState({
    registrationNo: "",
    busType: "AC_SEATER",
    capacity: 40
  });
  const [editingBus, setEditingBus] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.userId) {
      loadBuses();
    }
  }, [user]);

  const loadBuses = async () => {
    if (!user?.userId) return;
    try {
      console.log("Fetching buses for user:", user.userId); // Debug Log
      const res = await agentService.getMyBuses(user.userId);
      console.log("Bus Fetch Response:", res.data); // Debug Log
      
      // Ensure we are setting a valid array
      setBuses(res?.data?.data || []);
    } catch (err) { 
      console.error("Failed to load buses", err); 
      setBuses([]); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.userId) {
      alert("User session invalid. Please relogin.");
      return;
    }

    try {
      if (editingBus) {
        await agentService.updateBus(editingBus.busId, formData);
        setMessage("Bus updated successfully!");
        setEditingBus(null);
      } else {
        await agentService.addBus(user.userId, formData);
        setMessage("Bus added successfully!");
      }
      setFormData({ registrationNo: "", busType: "AC_SEATER", capacity: 40 });
      
      // Force reload after successful add/update
      await loadBuses(); 
    } catch (err) {
      console.error("Bus operation error:", err);
      setMessage("Error: " + (err.response?.data?.message || ""));
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setFormData({
      registrationNo: bus.registrationNo,
      busType: bus.busType,
      capacity: bus.capacity
    });
  };

  const handleCancelEdit = () => {
    setEditingBus(null);
    setFormData({ registrationNo: "", busType: "AC_SEATER", capacity: 40 });
  };

  const handleDelete = async (busId) => {
      if(window.confirm("Delete this bus? This will remove related schedules.")) {
          try {
              await agentService.deleteBus(busId);
              await loadBuses(); // Reload after delete
          } catch(err) { 
              alert("Delete failed"); 
          }
      }
  };

  return (
    <div className="container">
      <h2>Manage Fleet</h2>
      
      {/* Add Bus Form */}
      <div className="card">
        <h3>{editingBus ? 'Update Bus' : 'Add New Bus'}</h3>
        {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Registration No</label>
            <input 
                type="text" 
                className="form-control" 
                value={formData.registrationNo} 
                onChange={e => setFormData({...formData, registrationNo: e.target.value})} 
                required
            />
          </div>
          <div className="form-group">
            <label>Bus Type</label>
            <select 
                className="form-control" 
                value={formData.busType} 
                onChange={e => setFormData({...formData, busType: e.target.value})}
            >
              <option value="AC_SEATER">AC Seater</option>
              <option value="AC_SLEEPER">AC Sleeper</option>
              <option value="NON_AC_SEATER">Non-AC Seater</option>
              <option value="NON_AC_SLEEPER">Non-AC Sleeper</option>
              <option value="VOLVO">Volvo</option>
            </select>
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input 
                type="number" 
                className="form-control" 
                value={formData.capacity} 
                onChange={e => setFormData({...formData, capacity: e.target.value})} 
                required 
                min="10"
            />
          </div>
          <div style={{display: 'flex', gap: '10px'}}>
            <button type="submit" className="btn btn-primary">
              {editingBus ? 'Update Bus' : 'Add Bus'}
            </button>
            {editingBus && (
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Bus List */}
      <div className="card">
        <h3>My Buses</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses?.length > 0 ? (
              buses.map((bus) => (
                <tr key={bus.busId}>
                  <td>{bus.registrationNo}</td>
                  <td>{bus.busType}</td>
                  <td>{bus.capacity}</td>
                  <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(bus)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(bus.busId)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center">No buses found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageFleet;