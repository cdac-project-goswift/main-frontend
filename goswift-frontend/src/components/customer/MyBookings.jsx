import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import customerService from "../../services/customer.service";
import FeedbackForm from "./FeedbackForm";

const MyBookings = () => {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [viewType, setViewType] = useState("all");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [feedbackStatus, setFeedbackStatus] = useState({});

  // ---------- Helpers ----------
  const buildDateTime = (date, time) => {
    if (!date || !time) return null;
    const [hours, minutes] = time.split(":");
    const dt = new Date(date);
    dt.setHours(Number(hours), Number(minutes), 0);
    return dt;
  };

  const isCompleted = (booking) => {
    const arrivalDT = buildDateTime(
      booking.journeyDate,
      booking.schedule?.arrivalTime
    );
    return arrivalDT ? arrivalDT < new Date() : false;
  };

  // ---------- Load bookings ----------
  useEffect(() => {
    if (!user) return;

    customerService
      .getMyBookings(user.userId)
      .then((data) => {
        let filtered = [...data];
        const now = new Date();

        if (viewType === "upcoming") {
          filtered = filtered.filter((b) => {
            const depDT = buildDateTime(
              b.journeyDate,
              b.schedule?.departureTime
            );
            return depDT ? depDT > now : false;
          });
        }

        if (viewType === "completed") {
          filtered = filtered.filter((b) => isCompleted(b));
        }

        setBookings(filtered);

        // Check feedback only for completed bookings
        filtered.forEach((b) => {
          if (isCompleted(b)) {
            customerService
              .checkFeedbackExists(b.bookingId)
              .then((exists) =>
                setFeedbackStatus((prev) => ({
                  ...prev,
                  [b.bookingId]: exists,
                }))
              )
              .catch(() => {});
          }
        });
      })
      .catch((err) => {
        console.error("Failed to load bookings", err);
        setBookings([]);
      });
  }, [user, viewType]);

  // ---------- Feedback ----------
  const handleFeedback = (booking) => {
    setSelectedBooking(booking);
    setShowFeedbackForm(true);
  };

  const handleFeedbackSubmit = () => {
    setShowFeedbackForm(false);
    setFeedbackStatus((prev) => ({
      ...prev,
      [selectedBooking.bookingId]: true,
    }));
  };

  // ---------- UI ----------
  return (
    <div className="container" style={{ marginTop: 20, marginBottom: 40 }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h2 style={{ color: "#007bff", fontWeight: 600 }}>📋 My Bookings</h2>
        <p style={{ color: "#6c757d" }}>
          Track and manage your bus reservations
        </p>
      </div>

      {/* Filters */}
      <div
        className="btn-group mb-4"
        style={{ display: "flex", justifyContent: "center", gap: 10 }}
      >
        {["all", "upcoming", "completed"].map((type) => (
          <button
            key={type}
            className={`btn ${
              viewType === type ? "btn-primary" : "btn-outline-primary"
            }`}
            style={{ borderRadius: 25, padding: "10px 20px" }}
            onClick={() => setViewType(type)}
          >
            {type === "all" && "📊 All Bookings"}
            {type === "upcoming" && "🚀 Upcoming Trips"}
            {type === "completed" && "✅ Completed Trips"}
          </button>
        ))}
      </div>

      {/* Empty */}
      {bookings.length === 0 ? (
        <div className="card p-5 text-center shadow-sm rounded">
          <div style={{ fontSize: 48 }}></div>
          <h5>No bookings found</h5>
        </div>
      ) : (
        <div className="card shadow-sm rounded overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Ref</th>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Passengers</th>
                  <th>Fare</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => {
                  const completed = isCompleted(b);

                  return (
                    <tr key={b.bookingId}>
                      <td className="fw-bold text-primary">
                        {b.bookingRefNo}
                      </td>

                      <td>
                        {b.schedule?.sourceCity?.cityName} →{" "}
                        {b.schedule?.destCity?.cityName}
                      </td>

                      <td>
                        {new Date(b.journeyDate).toLocaleDateString()}
                      </td>

                      <td className="text-success">
                        {b.schedule?.departureTime || "--"}
                      </td>

                      <td className="text-danger">
                        {b.schedule?.arrivalTime || "--"}
                      </td>

                      <td>
                        {b.tickets?.map((t) => (
                          <div key={t.ticketId}>
                            {t.passengerName} (Seat {t.seatNo})
                          </div>
                        ))}
                      </td>

                      <td className="fw-bold text-success">
                        ₹{b.totalFare}
                      </td>

                      <td>
                        <span className="badge bg-success">
                          {b.status}
                        </span>
                      </td>

                      <td>
                        {completed && b.status === "Confirmed" ? (
                          feedbackStatus[b.bookingId] ? (
                            <span className="text-success">
                              ✓ Feedback Submitted
                            </span>
                          ) : (
                            <button
                              className="btn btn-info btn-sm"
                              onClick={() => handleFeedback(b)}
                            >
                              📝 Add Feedback
                            </button>
                          )
                        ) : (
                          <small className="text-muted">
                            📞 {b.schedule?.bus?.agency?.user?.phoneNumber ||
                              "N/A"}
                          </small>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showFeedbackForm && selectedBooking && (
        <FeedbackForm
          booking={selectedBooking}
          onClose={() => setShowFeedbackForm(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default MyBookings;
