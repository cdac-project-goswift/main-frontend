import { Link } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { useEffect, useState } from "react";
import adminService from "../../services/admin.service";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          adminService.getSystemStats(),
          adminService.getAllBookings()
        ]);
        
        setStats(statsRes?.data || null);
        // Get last 5 bookings for recent activity
        const allBookings = bookingsRes?.data || [];
        setRecentBookings(allBookings.slice(-5).reverse());
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  const cards = [
    { title: "Manage Users", link: "/admin/users", desc: "Block/Unblock users", color: "#007bff" },
    { title: "System Data", link: "/admin/system-data", desc: "Manage Cities & Config", color: "#28a745" },
    { title: "System Reports", link: "/admin/reports", desc: "View Revenue & Stats", color: "#ffc107" },
    { title: "View Bookings", link: "/admin/bookings", desc: "Search & View All Bookings", color: "#17a2b8" },
  ];

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <p className="mb-4">Welcome back, {user?.username}. What would you like to do today?</p>
      
      {/* Stats Overview */}
      {!loading && stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "30px" }}>
          <div className="card" style={{ textAlign: "center", backgroundColor: "#e8f5e8" }}>
            <h4>Total Revenue</h4>
            <p style={{ fontSize: "1.5rem", color: "green", fontWeight: "bold" }}>
              ₹{stats?.totalRevenue?.toLocaleString() || 0}
            </p>
          </div>
          <div className="card" style={{ textAlign: "center", backgroundColor: "#e8f0ff" }}>
            <h4>Total Bookings</h4>
            <p style={{ fontSize: "1.5rem", color: "blue", fontWeight: "bold" }}>
              {stats?.totalBookings || 0}
            </p>
          </div>
          <div className="card" style={{ textAlign: "center", backgroundColor: "#fff3e0" }}>
            <h4>Active Buses</h4>
            <p style={{ fontSize: "1.5rem", color: "orange", fontWeight: "bold" }}>
              {stats?.activeBuses || 0}
            </p>
          </div>
          <div className="card" style={{ textAlign: "center", backgroundColor: "#f3e5f5" }}>
            <h4>Active Agents</h4>
            <p style={{ fontSize: "1.5rem", color: "purple", fontWeight: "bold" }}>
              {stats?.activeAgents || 0}
            </p>
          </div>
        </div>
      )}
      
      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        {cards.map((card, index) => (
          <div key={index} className="card" style={{ borderTop: `4px solid ${card.color}` }}>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <Link to={card.link} className="btn btn-primary" style={{ marginTop: "10px" }}>Go</Link>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      {!loading && recentBookings.length > 0 && (
        <div className="card">
          <h3>Recent Bookings</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Ref No</th>
                <th>Route</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(booking => (
                <tr key={booking.bookingId}>
                  <td>{booking.bookingRefNo}</td>
                  <td>{booking.schedule?.sourceCity?.cityName} → {booking.schedule?.destCity?.cityName}</td>
                  <td>{booking.user?.email}</td>
                  <td>₹{booking.totalFare}</td>
                  <td><span className="badge bg-success">{booking.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;