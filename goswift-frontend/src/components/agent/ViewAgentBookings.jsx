import { useState, useEffect } from "react";
import agentService from "../../services/agent.service";
import { useAuth } from "../../providers/AuthProvider";

const ViewAgentBookings = () => {
  const { user } = useAuth();
  // Fix 1: Init array
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await agentService.getAgencyBookings(user.userId);
      // Fix 2: Safety check
      setBookings(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading passenger lists...</div>;

  return (
    <div className="container">
      <h2>Agency Bookings</h2>
      <p>Passengers booked on your fleet.</p>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Booking Ref</th>
              <th>Bus Reg No</th>
              <th>Journey Date</th>
              <th>Route</th>
              <th>Passengers</th>
              <th>Fare</th>
            </tr>
          </thead>
          <tbody>
            {/* Fix 3: Conditional map and deep optional chaining */}
            {bookings?.length > 0 ? bookings.map((b) => (
              <tr key={b.bookingId}>
                <td><strong>{b.bookingRefNo}</strong></td>
                <td>{b.schedule?.bus?.registrationNo}</td>
                <td>{b.journeyDate}</td>
                <td>{b.schedule?.sourceCity?.cityName} ➝ {b.schedule?.destCity?.cityName}</td>
                <td>
                   {/* Check tickets array existence */}
                   {b.tickets?.length > 0 ? b.tickets.map(t => (
                      <div key={t.ticketId} style={{fontSize: '0.9em', padding: '2px 0'}}>
                         <strong>{t.passengerName}</strong> ({t.passengerGender}, {t.passengerAge}) - {t.seatNo}
                      </div>
                   )) : 'No Passengers'}
                </td>
                <td>₹{b.totalFare}</td>
              </tr>
            )) : <tr><td colSpan="6">No bookings found for your buses yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAgentBookings;