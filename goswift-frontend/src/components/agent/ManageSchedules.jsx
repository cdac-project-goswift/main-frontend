import { useState, useEffect } from "react";
import agentService from "../../services/agent.service";
import { useAuth } from "../../providers/AuthProvider";

const ManageSchedules = () => {
  const { user } = useAuth();
  // Initialize all arrays as empty to avoid "undefined" map errors
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [cities, setCities] = useState([]);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    busId: "", sourceCity: "", destCity: "", departureTime: "", arrivalTime: "", baseFare: ""
  });

  useEffect(() => {
    if (user?.userId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [resBuses, resSchedules, resCities] = await Promise.all([
        agentService.getMyBuses(user.userId),
        agentService.getMySchedules(user.userId),
        agentService.getAllCities()
      ]);
      
      // --- DEBUG LOGS (Check your browser console!) ---
      console.log("Full Cities Response Object:", resCities);
      
      // 1. Handle Buses
      setBuses(resBuses?.data?.data || []);

      // 2. Handle Schedules
      setSchedules(resSchedules?.data?.data || []);
      
      // 3. Handle Cities (Robust check)
      // The API might return { status: "SUCCESS", data: [...] } OR directly [...]
      let citiesData = [];
      if (resCities?.data?.data && Array.isArray(resCities.data.data)) {
          citiesData = resCities.data.data;
      } else if (resCities?.data && Array.isArray(resCities.data)) {
          citiesData = resCities.data;
      } else if (Array.isArray(resCities)) {
          citiesData = resCities;
      }
      
      console.log("Extracted Cities Data:", citiesData); // Verify this is an array of objects
      setCities(citiesData);

    } catch (err) { 
      console.error("Error loading data in ManageSchedules", err);
      // Fallback to empty arrays only if they haven't been set yet or on critical failure
      // We don't want to wipe out existing state if only one call fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.sourceCity === formData.destCity) {
      alert("Source and Destination cannot be the same!");
      return;
    }
    try {
      await agentService.addSchedule(user.userId, formData);
      setMessage("Schedule created successfully!");
      // Reset form (optional)
      // setFormData({...formData, departureTime: "", arrivalTime: ""}); 
      await loadData(); // Reload list
    } catch (err) {
      setMessage("Failed: " + (err.response?.data?.message || "Error"));
    }
  };

  const handleDelete = async (id) => {
      if(window.confirm("Delete this route?")) {
          try { 
            await agentService.deleteSchedule(id); 
            await loadData(); 
          } catch(e) { alert("Delete failed"); }
      }
  };

  return (
    <div className="container">
      <h2>Manage Schedules</h2>
      
      {/* Create Schedule Form */}
      <div className="card">
        <h3>Create Schedule</h3>
        {message && <p style={{color: message.includes("Failed") ? "red" : "green"}}>{message}</p>}
        <form onSubmit={handleSubmit}>
           <div className="form-group">
              <label>Bus</label>
              <select 
                className="form-control" 
                value={formData.busId} 
                onChange={e => setFormData({...formData, busId: e.target.value})} 
                required
              >
                 <option value="">Select Bus</option>
                 {/* Safety check for buses array */}
                 {buses?.map(b => (
                   <option key={b.busId} value={b.busId}>
                     {b.registrationNo} ({b.busType})
                   </option>
                 ))}
              </select>
           </div>
           
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div className="form-group">
              <label>Source</label>
              <select 
                className="form-control" 
                value={formData.sourceCity} 
                onChange={e => setFormData({...formData, sourceCity: e.target.value})} 
                required
              >
                <option value="">From</option>
                {/* Renders cities or fallback message */}
                {cities?.length > 0 ? (
                  cities.map(c => (
                    <option key={c.cityId} value={c.cityName}>{c.cityName}</option>
                  ))
                ) : (
                  <option disabled>No cities available</option>
                )}
              </select>
            </div>
            <div className="form-group">
              <label>Destination</label>
              <select 
                className="form-control" 
                value={formData.destCity} 
                onChange={e => setFormData({...formData, destCity: e.target.value})} 
                required
              >
                <option value="">To</option>
                {cities?.length > 0 ? (
                  cities.map(c => (
                    <option key={c.cityId} value={c.cityName}>{c.cityName}</option>
                  ))
                ) : (
                  <option disabled>No cities available</option>
                )}
              </select>
            </div>
          </div>
          
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
             <div className="form-group">
                <label>Departure</label>
                <input type="time" className="form-control" value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} required />
             </div>
             <div className="form-group">
                <label>Arrival</label>
                <input type="time" className="form-control" value={formData.arrivalTime} onChange={e => setFormData({...formData, arrivalTime: e.target.value})} required />
             </div>
           </div>
           <div className="form-group">
              <label>Base Fare (₹)</label>
              <input type="number" className="form-control" value={formData.baseFare} onChange={e => setFormData({...formData, baseFare: e.target.value})} required />
           </div>
           
           <button type="submit" className="btn btn-primary mt-3">Create Schedule</button>
        </form>
      </div>

      {/* Schedule List */}
      <div className="card">
         <h3>My Routes</h3>
         <table className="table">
            <thead><tr><th>Bus</th><th>Route</th><th>Time</th><th>Fare</th><th>Action</th></tr></thead>
            <tbody>
               {/* Conditional rendering for schedules list */}
               {schedules?.length > 0 ? (
                 schedules.map(s => (
                  <tr key={s.scheduleId}>
                     <td>{s.bus?.registrationNo}</td>
                     <td>{s.sourceCity?.cityName} ➝ {s.destCity?.cityName}</td>
                     <td>{s.departureTime} - {s.arrivalTime}</td>
                     <td>₹{s.baseFare}</td>
                     <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.scheduleId)}>Delete</button></td>
                  </tr>
                 ))
               ) : (
                 <tr><td colSpan="5" className="text-center">No schedules found</td></tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default ManageSchedules;