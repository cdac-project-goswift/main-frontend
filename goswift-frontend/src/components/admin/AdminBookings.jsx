import { useState, useEffect } from "react";
import adminService from "../../services/admin.service";
import api from "../../services/api";

const AdminBookings = () => {
  const [agencies, setAgencies] = useState([]);
  const [buses, setBuses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({ agencyId: "", busId: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookingsRes, agenciesRes] = await Promise.all([
          adminService.getAllBookings(),
          adminService.getAllAgencies()
        ]);
        
        console.log('Bookings:', bookingsRes);
        console.log('Agencies:', agenciesRes);
        
        setBookings(bookingsRes?.data || []);
        setAgencies(agenciesRes?.data || []);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAgencyChange = async (agencyId) => {
    setFilters({ agencyId, busId: "" });
    setBuses([]);
    if(agencyId) {
        try {
            const res = await api.get(`/admin/agencies/${agencyId}/buses`);
            setBuses(res?.data?.data || []);
            
            const bk = await adminService.searchBookings(agencyId, null);
            setBookings(bk?.data || []);
        } catch(e) {
            setBookings([]);
        }
    } else {
        const bk = await adminService.getAllBookings();
        setBookings(bk?.data || []);
    }
  };

  const handleBusChange = async (busId) => {
      setFilters({ ...filters, busId });
      if (busId) {
          try {
              const bk = await adminService.searchBookings(filters.agencyId, busId);
              setBookings(bk?.data || []);
          } catch(e) {
              setBookings([]);
          }
      } else {
          try {
              const bk = await adminService.searchBookings(filters.agencyId, null);
              setBookings(bk?.data || []);
          } catch(e) {
              setBookings([]);
          }
      }
  };

  return (
    <div className="container">
      <h2>All Bookings</h2>
      
      {loading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      
      <div className="card">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
            <div className="form-group">
                <label>Select Agency</label>
                <select className="form-control" onChange={e => handleAgencyChange(e.target.value)}>
                    <option value="">-- Select Agency --</option>
                    {agencies?.map(a => <option key={a.agencyId} value={a.agencyId}>{a.agencyName}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label>Select Bus</label>
                <select className="form-control" onChange={e => handleBusChange(e.target.value)} disabled={!filters.agencyId}>
                    <option value="">-- All Buses --</option>
                    {buses?.map(b => <option key={b.busId} value={b.busId}>{b.registrationNo} ({b.busType})</option>)}
                </select>
            </div>
        </div>
      </div>

      <div className="card">
         <h4>Results ({bookings.length})</h4>
         <table className="table">
            <thead>
                <tr>
                    <th>Ref No</th>
                    <th>Bus</th>
                    <th>Route</th>
                    <th>User</th>
                    <th>Total Fare</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {bookings?.length > 0 ? bookings.map(b => (
                    <tr key={b.bookingId}>
                        <td>{b.bookingRefNo}</td>
                        <td>{b.schedule?.bus?.registrationNo || 'N/A'}</td>
                        <td>{b.schedule?.sourceCity?.cityName} ➝ {b.schedule?.destCity?.cityName}</td>
                        <td>{b.user?.email}</td>
                        <td>₹{b.totalFare}</td>
                        <td>{b.status}</td>
                    </tr>
                )) : <tr><td colSpan="6" className="text-center">No bookings found</td></tr>}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default AdminBookings;