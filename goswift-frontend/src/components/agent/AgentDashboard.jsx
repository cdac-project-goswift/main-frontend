import { Link } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { useEffect, useState } from "react";
import agentService from "../../services/agent.service";

const AgentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ buses: 0, schedules: 0, bookings: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  
  useEffect(() => {
    const loadAgentData = async () => {
      if (!user?.userId) return;
      
      try {
        const [busesRes, schedulesRes, bookingsRes] = await Promise.all([
          agentService.getMyBuses(user.userId),
          agentService.getMySchedules(user.userId),
          agentService.getAgencyBookings(user.userId)
        ]);
        
        const buses = busesRes?.data?.data || [];
        const schedules = schedulesRes?.data?.data || [];
        const bookings = bookingsRes?.data?.data || [];
        
        setStats({
          buses: buses.length,
          schedules: schedules.length,
          bookings: bookings.length
        });
        
        // Get last 3 bookings
        setRecentBookings(bookings.slice(-3).reverse());
      } catch (error) {
        console.error("Failed to load agent data", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAgentData();
  }, [user]);

  const cards = [
    { title: "Manage Fleet", link: "/agent/fleet", desc: "Add or View Buses", color: "#17a2b8" },
    { title: "Manage Schedules", link: "/agent/schedules", desc: "Create Routes", color: "#6610f2" },
    { title: "View Bookings", link: "/agent/bookings", desc: "Check Passenger Lists", color: "#fd7e14" },
  ];

  return (
    <div className="container">
      <h2>Agent Dashboard</h2>
      <p className="mb-4">Hello, {user?.firstName || 'Agent'}. Manage your travels here.</p>
      
      {/* Quick Stats */}
      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px", marginBottom: "30px" }}>
          <div className="card" style={{ textAlign: "center", backgroundColor: "#e8f4fd" }}>
            <h4>My Buses</h4>
            <p style={{ fontSize: "2rem", color: "#17a2b8", fontWeight: "bold" }}>{stats.buses}</p>
          </div>
          <div className="card" style={{ textAlign: "center", backgroundColor: "#f0e6ff" }}>
            <h4>Active Routes</h4>
            <p style={{ fontSize: "2rem", color: "#6610f2", fontWeight: "bold" }}>{stats.schedules}</p>
          </div>
          <div className="card" style={{ textAlign: "center", backgroundColor: "#fff2e6" }}>
            <h4>Total Bookings</h4>
            <p style={{ fontSize: "2rem", color: "#fd7e14", fontWeight: "bold" }}>{stats.bookings}</p>
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

      {/* Recent Bookings */}
      {!loading && recentBookings.length > 0 && (
        <div className="card">
          <h3>Recent Bookings</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Ref No</th>
                <th>Bus</th>
                <th>Route</th>
                <th>Date</th>
                <th>Passengers</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(booking => (
                <tr key={booking.bookingId}>
                  <td>{booking.bookingRefNo}</td>
                  <td>{booking.schedule?.bus?.registrationNo}</td>
                  <td>{booking.schedule?.sourceCity?.cityName} → {booking.schedule?.destCity?.cityName}</td>
                  <td>{booking.journeyDate}</td>
                  <td>{booking.tickets?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;