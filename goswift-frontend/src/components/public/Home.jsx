import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import customerService from "../../services/customer.service";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState({
    source: "",
    dest: "",
    date: ""
  });
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    customerService.getAllCities()
      .then(cities => setCities(cities || []))
      .catch(err => console.error("Failed to load cities", err));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search.source === search.dest) {
      alert("Source and Destination cannot be the same!");
      return;
    }
    try {
      const results = await customerService.searchBuses(search.source, search.dest, search.date);
      setSearchResults(results || []);
      setHasSearched(true);
    } catch (err) {
      console.error("Search failed", err);
      setSearchResults([]);
      setHasSearched(true);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Book Your Journey, Your Way.</h1>
            <p className="hero-subtitle">Comfortable, safe, and affordable bus tickets at your fingertips.</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <h2 className="search-title">Find Your Bus</h2>
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label>From</label>
              <select 
                className="form-control" 
                value={search.source} 
                onChange={(e) => setSearch({...search, source: e.target.value})} 
                required
              >
                <option value="">Select Source</option>
                {cities.map(c => <option key={c.cityId} value={c.cityName}>{c.cityName}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>To</label>
              <select 
                className="form-control" 
                value={search.dest} 
                onChange={(e) => setSearch({...search, dest: e.target.value})} 
                required
              >
                <option value="">Select Destination</option>
                {cities.map(c => <option key={c.cityId} value={c.cityName}>{c.cityName}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={search.date} 
                onChange={(e) => setSearch({...search, date: e.target.value})} 
                required 
                min={new Date().toISOString().split("T")[0]} 
              />
            </div>

            <button type="submit" className="btn-search">Search Buses</button>
          </form>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="results-section">
          <div className="results-container">
            <h3 className="results-title">Available Buses</h3>
            {searchResults.length === 0 ? (
              <p className="no-results">No buses found for the selected route and date.</p>
            ) : (
              <div className="results-grid">
                {searchResults.map((bus) => (
                  <div key={bus.scheduleId} className="bus-card">
                    <div className="bus-header">
                      <h4>{bus.busNumber}</h4>
                      <span className="bus-type">{bus.busType?.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="bus-details">
                      <div className="detail-row">
                        <span className="label">Agency:</span>
                        <span className="value agency">{bus.agencyName || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Departure:</span>
                        <span className="value">{bus.departureTime}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Arrival:</span>
                        <span className="value">{bus.arrivalTime}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Available Seats:</span>
                        <span className="value seats">{bus.availableSeats}</span>
                      </div>
                    </div>
                    <button 
                      className="btn-book-disabled" 
                      disabled
                      title="Please login to book"
                    >
                      Login to Book
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="features-section">
        <div className="features-container">
          <h2 className="features-title">Why Choose GoSwift?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>AllTime Routes</h3>
              <p>Our buses run from 11 PM to 6 AM. Arrive at your destination refreshed and ready for the day.</p>
            </div>
            <div className="feature-card">
              <h3>Key Cities Covered</h3>
              <p>We connect major hubs in Maharashtra, including Pune, Mumbai, and Nagpur. More routes coming soon!</p>
            </div>
            <div className="feature-card">
              <h3>Comfort & Safety</h3>
              <p>Travel with peace of mind in our clean, modern, and safe sleeper and semi-sleeper buses.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
