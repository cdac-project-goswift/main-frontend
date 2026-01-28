import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import api from "../../services/api";

const BookingForm = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Guard against direct access
  if (!state) { 
    return <div className="container">Invalid access. Please search for a bus first.</div>; 
  }
  const { bus, journeyDate } = state;

  // Extract city name from string or object
  const getCityName = (cityData) => {
    if (typeof cityData === 'string') {
      // If it's "City(cityId=1, cityName=Pune, ...)", extract cityName
      const match = cityData.match(/cityName=([^,)]+)/);
      return match ? match[1] : cityData;
    }
    return cityData?.cityName || cityData;
  };

  const [loading, setLoading] = useState(false);
  // Fix 1: Initialize array
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);

  // Fetch Occupied Seats on Mount
  useEffect(() => {
    if(!bus?.scheduleId) return;
    
    api.get(`/customer/schedule/${bus.scheduleId}/seats`, { params: { date: journeyDate } })
       // Fix 2: Safety check for response data
       .then(res => setOccupiedSeats(res?.data?.data || []))
       .catch(err => {
           console.error("Failed to fetch seats", err);
           setOccupiedSeats([]);
       });
  }, [bus, journeyDate]);

  // Handle Seat Click
  const toggleSeat = (seatLabel) => {
    if (occupiedSeats.includes(seatLabel)) return;

    if (selectedSeats.includes(seatLabel)) {
      // Deselect
      setSelectedSeats(selectedSeats.filter(s => s !== seatLabel));
      setPassengers(passengers.filter(p => p.seatNo !== seatLabel));
    } else {
      // Select
      setSelectedSeats([...selectedSeats, seatLabel]);
      // Add empty passenger entry for this seat
      setPassengers([...passengers, { passengerName: "", passengerAge: "", passengerGender: "MALE", seatNo: seatLabel }]);
    }
  };

  // Handle Passenger Input Change
  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(selectedSeats.length === 0) { alert("Please select at least one seat."); return; }
    
    setLoading(true);
    const bookingRequest = {
      userId: user.userId,
      scheduleId: bus.scheduleId,
      journeyDate: journeyDate,
      passengers: passengers
    };

    try {
      await api.post("/customer/book", bookingRequest);
      alert("Booking Confirmed!");
      navigate("/customer/my-bookings");
    } catch (error) {
      alert("Booking Failed: " + (error.response?.data?.message || "Error"));
    } finally {
      setLoading(false);
    }
  };

  // Generate Seat Grid (Bus Layout: 2-2 configuration)
  const renderGrid = () => {
    const capacity = bus.capacity || 40;
    const rows = Math.ceil(capacity / 4);
    
    return (
      <div style={{padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', maxWidth: '350px'}}>
        {/* Front of Bus */}
        <div style={{textAlign: 'center', padding: '10px', backgroundColor: '#333', color: '#fff', borderRadius: '4px', marginBottom: '15px', fontWeight: 'bold'}}>
          🚌 FRONT
        </div>
        
        {/* Seat Rows */}
        {Array.from({length: rows}, (_, rowIdx) => {
          const startSeat = rowIdx * 4 + 1;
          return (
            <div key={rowIdx} style={{display: 'flex', gap: '40px', marginBottom: '8px', justifyContent: 'center'}}>
              {/* Left side - 2 seats */}
              <div style={{display: 'flex', gap: '8px'}}>
                {[0, 1].map(offset => {
                  const seatNum = startSeat + offset;
                  if (seatNum > capacity) return null;
                  const label = `A${seatNum}`;
                  const isOccupied = occupiedSeats.includes(label);
                  const isSelected = selectedSeats.includes(label);
                  
                  return (
                    <div key={label} onClick={() => toggleSeat(label)}
                         style={{
                           width: '45px', height: '45px', borderRadius: '6px',
                           display: 'flex', alignItems: 'center', justifyContent: 'center',
                           cursor: isOccupied ? 'not-allowed' : 'pointer',
                           backgroundColor: isOccupied ? '#999' : (isSelected ? '#28a745' : '#fff'),
                           border: '2px solid #666',
                           color: isSelected || isOccupied ? '#fff' : '#000',
                           fontWeight: 'bold', fontSize: '12px'
                         }}>
                      {label}
                    </div>
                  );
                })}
              </div>
              
              {/* Right side - 2 seats */}
              <div style={{display: 'flex', gap: '8px'}}>
                {[2, 3].map(offset => {
                  const seatNum = startSeat + offset;
                  if (seatNum > capacity) return null;
                  const label = `A${seatNum}`;
                  const isOccupied = occupiedSeats.includes(label);
                  const isSelected = selectedSeats.includes(label);
                  
                  return (
                    <div key={label} onClick={() => toggleSeat(label)}
                         style={{
                           width: '45px', height: '45px', borderRadius: '6px',
                           display: 'flex', alignItems: 'center', justifyContent: 'center',
                           cursor: isOccupied ? 'not-allowed' : 'pointer',
                           backgroundColor: isOccupied ? '#999' : (isSelected ? '#28a745' : '#fff'),
                           border: '2px solid #666',
                           color: isSelected || isOccupied ? '#fff' : '#000',
                           fontWeight: 'bold', fontSize: '12px'
                         }}>
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {/* Rear of Bus */}
        <div style={{textAlign: 'center', padding: '10px', backgroundColor: '#333', color: '#fff', borderRadius: '4px', marginTop: '15px', fontWeight: 'bold'}}>
          REAR 🚌
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <h2>Select Seats & Book</h2>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
        
        {/* Left: Seat Map */}
        <div className="card">
          <h4>Select Seats</h4>
          <div style={{marginBottom:'10px'}}>
            <span style={{marginRight:'10px'}}>⬜ Available</span>
            <span style={{marginRight:'10px'}}>🟩 Selected</span>
            <span style={{marginRight:'10px'}}>⬛ Occupied</span>
          </div>
          {renderGrid()}
        </div>

        {/* Right: Passenger Details */}
        <div className="card">
          <h4>Passenger Details</h4>
          <p><strong>Route:</strong> {getCityName(bus.sourceCity)} ➝ {getCityName(bus.destCity)}</p>
          <p><strong>Date:</strong> {journeyDate}</p>
          
          <form onSubmit={handleSubmit}>
            {passengers.map((p, idx) => (
              <div key={idx} style={{marginBottom:'15px', paddingBottom:'10px', borderBottom:'1px solid #eee'}}>
                <h5>Seat: {p.seatNo}</h5>
                <input type="text" placeholder="Name" className="form-control mb-2" required
                       value={p.passengerName} onChange={e => handlePassengerChange(idx, 'passengerName', e.target.value)} />
                <div style={{display:'flex', gap:'10px'}}>
                    <input type="number" placeholder="Age" className="form-control" required
                           value={p.passengerAge} onChange={e => handlePassengerChange(idx, 'passengerAge', e.target.value)} />
                    <select className="form-control" value={p.passengerGender} onChange={e => handlePassengerChange(idx, 'passengerGender', e.target.value)}>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
              </div>
            ))}
            
            {passengers.length > 0 && (
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? "Processing..." : `Confirm Booking (₹${passengers.length * bus.baseFare} + tax)`}
                </button>
            )}
            {passengers.length === 0 && <p>Please select a seat to proceed.</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;