import { useEffect, useState } from "react";
import adminService from "../../services/admin.service";

const SystemReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getSystemStats()
      .then(res => {
        console.log("Stats response:", res);
        setStats(res?.data || null);
      })
      .catch(err => {
          console.error("Failed to load reports", err);
          alert("Error loading reports: " + (err.response?.data?.message || err.message));
          setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container">Loading Reports...</div>;
  if (!stats) return <div className="container">Failed to load reports. Please try again later.</div>;

  return (
    <div className="container">
      <h2>System Reports</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <h3>Total Revenue</h3>
          {/* Fix 2: Safety check on properties */}
          <p style={{ fontSize: "2rem", color: "green", fontWeight: "bold" }}>
            ₹{stats.totalRevenue?.toLocaleString() || 0}
          </p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3>Total Bookings</h3>
          <p style={{ fontSize: "2rem", color: "blue", fontWeight: "bold" }}>
            {stats.totalBookings || 0}
          </p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3>Active Buses</h3>
          <p style={{ fontSize: "2rem", color: "orange", fontWeight: "bold" }}>
            {stats.activeBuses || 0}
          </p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3>Active Agents</h3>
          <p style={{ fontSize: "2rem", color: "purple", fontWeight: "bold" }}>
            {stats.activeAgents || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemReports;