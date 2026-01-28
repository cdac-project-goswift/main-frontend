import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Fix 1: Initialize as empty array
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract all params
  const source = searchParams.get("source");
  const dest = searchParams.get("dest");
  const date = searchParams.get("date");
  const busType = searchParams.get("busType");
  const sortBy = searchParams.get("sortBy");

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      try {
        // Pass all filters to the backend
        const res = await api.get("/customer/search", { 
            params: { source, dest, date, busType, sortBy } 
        });
        // Fix 2: Safety check for data
        setResults(res?.data?.data || []); 
      } catch (error) {
        console.error("Error fetching buses", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, [source, dest, date, busType, sortBy]);

  const handleBook = (bus) => {
    navigate("/customer/book", { state: { bus, journeyDate: date } });
  };

  if (loading) return <div className="container">Searching for buses...</div>;

  return (
    <div className="container">
      <h2>Search Results</h2>
      <p>Buses from <strong>{source}</strong> to <strong>{dest}</strong> on <strong>{date}</strong></p>

      {/* Fix 3: Check for array length to avoid map errors */}
      {results?.length === 0 ? (
        <div className="card">No buses found matching your criteria.</div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {results.map((bus) => (
            <div key={bus.scheduleId} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ color: "#007bff" }}>{bus.agencyName}</h3>
                {/* Safe string replacement */}
                <p><strong>{bus.busType ? bus.busType.replace('_', ' ') : 'Standard Bus'}</strong></p>
                <p>{bus.departureTime} ➝ {bus.arrivalTime}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <h3 style={{ color: "green" }}>₹{bus.baseFare}</h3>
                <p>{bus.availableSeats} Seats Available</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleBook(bus)}
                  disabled={bus.availableSeats <= 0}
                >
                  {bus.availableSeats > 0 ? "Book Now" : "Sold Out"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;