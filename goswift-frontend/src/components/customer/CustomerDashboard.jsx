import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState({
    source: "",
    dest: "",
    date: "",
    busType: "",
    sortBy: ""
  });

  useEffect(() => {
    // Use public endpoint for cities
    fetch('http://localhost:8080/api/auth/cities')
      .then(response => response.json())
      .then(data => {
        console.log("Cities:", data.data);
        setCities(data.data || []);
      })
      .catch(err => {
        console.error("Failed to load cities", err);
        setCities([]);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.source === search.dest) {
      alert("Source and Destination cannot be the same!");
      return;
    }
    const query = new URLSearchParams({
      source: search.source,
      dest: search.dest, 
      date: search.date,
      ...(search.busType && { busType: search.busType }),
      ...(search.sortBy && { sortBy: search.sortBy })
    }).toString();
    navigate(`/customer/search?${query}`);
  };

  return (
    <div className="container">
      {/* Welcome Message */}
      <div style={{ marginTop: "20px", marginBottom: "20px", textAlign: "center" }}>
        <h2 style={{ color: "#007bff", fontWeight: "500" }}>👋 Welcome, {user?.firstName}!</h2>
      </div>
      
      <div className="card" style={{ padding: "40px", backgroundColor: "#f8f9fa", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <h1 className="text-center text-primary mb-4">🚌 Find Your Next Journey</h1>
        
        <form onSubmit={handleSearch} style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto", gap: "15px", alignItems: "end" }}>
          
          <div className="form-group">
            <label style={{ fontWeight: "500", color: "#495057" }}>📍 From</label>
            <select className="form-control" style={{ borderRadius: "8px", border: "2px solid #dee2e6" }} value={search.source} onChange={(e) => setSearch({...search, source: e.target.value})} required>
              <option value="">Source</option>
              {cities?.map(c => <option key={c.cityId} value={c.cityName}>{c.cityName}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label style={{ fontWeight: "500", color: "#495057" }}>🎯 To</label>
            <select className="form-control" style={{ borderRadius: "8px", border: "2px solid #dee2e6" }} value={search.dest} onChange={(e) => setSearch({...search, dest: e.target.value})} required>
              <option value="">Destination</option>
              {cities?.map(c => <option key={c.cityId} value={c.cityName}>{c.cityName}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label style={{ fontWeight: "500", color: "#495057" }}>📅 Date</label>
            <input type="date" className="form-control" style={{ borderRadius: "8px", border: "2px solid #dee2e6" }} value={search.date} onChange={(e) => setSearch({...search, date: e.target.value})} required min={new Date().toISOString().split("T")[0]} />
          </div>

          <div className="form-group">
            <label style={{ fontWeight: "500", color: "#495057" }}>🚐 Type</label>
            <select className="form-control" style={{ borderRadius: "8px", border: "2px solid #dee2e6" }} value={search.busType} onChange={(e) => setSearch({...search, busType: e.target.value})}>
              <option value="">Any</option>
              <option value="AC_SLEEPER">AC Sleeper</option>
              <option value="AC_SEATER">AC Seater</option>
              <option value="NON_AC_SEATER">Non-AC Seater</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ fontWeight: "500", color: "#495057" }}>🔄 Sort By</label>
            <select className="form-control" style={{ borderRadius: "8px", border: "2px solid #dee2e6" }} value={search.sortBy} onChange={(e) => setSearch({...search, sortBy: e.target.value})}>
              <option value="">Default</option>
              <option value="price">Price (Low to High)</option>
              <option value="time">Time (Earliest)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: "45px", marginBottom: "15px", borderRadius: "8px", fontWeight: "500" }}>🔍 Search</button>
        </form>
      </div>

      {/* Quick Actions Section */}
      <div className="row" style={{marginTop: "30px"}}>
        <div className="col-md-6">
          <div className="card" style={{padding: "25px", cursor: "pointer", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", transition: "transform 0.2s"}} onClick={() => navigate('/customer/my-bookings')}>
            <h4 style={{ color: "#007bff" }}>📋 View My Bookings</h4>
            <p style={{ color: "#6c757d" }}>Check your upcoming trips and completed journeys</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;