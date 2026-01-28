import { useState, useEffect } from "react";
import adminService from "../../services/admin.service";

const ManageSystemData = () => {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState("");
  const [config, setConfig] = useState({ serviceTaxPct: 0, bookingFee: 0 });
  const [message, setMessage] = useState("");
  const [configMessage, setConfigMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [citiesRes, configRes] = await Promise.all([
        adminService.getAllCities(),
        adminService.getSystemConfig()
      ]);

      // DEBUG LOGS
      console.log("Cities API Response:", citiesRes);
      console.log("Config API Response:", configRes);

      // Handle Cities
      // Check if data is nested in .data.data (ApiResponse wrapper) OR just .data (Direct list)
      const citiesData = citiesRes?.data?.data || citiesRes?.data || [];
      if (Array.isArray(citiesData)) {
          setCities(citiesData);
      } else {
          console.error("Cities data is not an array:", citiesData);
          setCities([]);
      }
      
      // Handle Config
      const configData = configRes?.data?.data || configRes?.data || null;
      if (configData) {
        setConfig(configData);
      }
    } catch (error) {
      console.error("Error loading system data", error);
      setCities([]); 
    }
  };

  const handleAddCity = async (e) => {
    e.preventDefault();
    if (!newCity.trim()) return;
    try {
      await adminService.addCity({ cityName: newCity, state: "Maharashtra", country: "India" }); 
      setNewCity("");
      setMessage("City added successfully!");
      loadData();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to add city.");
    }
  };

  const handleUpdateConfig = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateSystemConfig(config);
      setConfigMessage("Configuration updated successfully!");
      setTimeout(() => setConfigMessage(""), 3000);
    } catch (error) {
      setConfigMessage("Failed to update configuration.");
    }
  };

  return (
    <div className="container">
      <h2>System Data Management</h2>
      
      {/* Global Config Section */}
      <div className="card" style={{ borderTop: "4px solid #ffc107" }}>
        <h3>Global Configuration</h3>
        {configMessage && <p style={{ color: "green" }}>{configMessage}</p>}
        <form onSubmit={handleUpdateConfig} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "20px", alignItems: "end" }}>
          <div className="form-group">
            <label>Service Tax (%)</label>
            <input 
              type="number" 
              step="0.01"
              className="form-control" 
              value={config.serviceTaxPct || 0} 
              onChange={(e) => setConfig({...config, serviceTaxPct: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Booking Fee (₹)</label>
            <input 
              type="number" 
              step="0.01"
              className="form-control" 
              value={config.bookingFee || 0} 
              onChange={(e) => setConfig({...config, bookingFee: e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: "45px" }}>Update Config</button>
        </form>
      </div>

      {/* City Management Section */}
      <div className="card" style={{ borderTop: "4px solid #28a745" }}>
        <h3>Add New City</h3>
        {message && <p style={{ color: "blue" }}>{message}</p>}
        <form onSubmit={handleAddCity} style={{ display: "flex", gap: "10px" }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Enter City Name (e.g. Pune)"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Add City</button>
        </form>
      </div>

      <div className="card">
        <h3>Available Cities ({cities.length})</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {cities.length > 0 ? cities.map((city) => (
            <span key={city.cityId} style={{ 
              backgroundColor: "#e9ecef", 
              padding: "5px 15px", 
              borderRadius: "20px",
              border: "1px solid #ced4da" 
            }}>
              {city.cityName}
            </span>
          )) : <p>No cities found.</p>}
        </div>
      </div>
    </div>
  );
};

export default ManageSystemData;