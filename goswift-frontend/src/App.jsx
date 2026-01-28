import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Navbar from "./components/layout/Navbar";
import NotFound from "./components/common/NotFound";
import ProtectedRoute from "./components/common/ProtectedRoute";
import UserLayout from "./components/layout/UserLayout";
import Profile from "./components/common/Profile";
import Home from "./components/public/Home";

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageUsers from "./components/admin/ManageUsers";
import ManageSystemData from "./components/admin/ManageSystemData";
import SystemReports from "./components/admin/SystemReports";
import AdminBookings from "./components/admin/AdminBookings"; // NEW

// Agent Components
import AgentDashboard from "./components/agent/AgentDashboard";
import ManageFleet from "./components/agent/ManageFleet";
import ManageSchedules from "./components/agent/ManageSchedules";
import ViewAgentBookings from "./components/agent/ViewAgentBookings";

// Customer Components
import CustomerDashboard from "./components/customer/CustomerDashboard";
import SearchResults from "./components/customer/SearchResults";
import BookingForm from "./components/customer/BookingForm";
import MyBookings from "./components/customer/MyBookings";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<UserLayout />}>
            
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <Routes>
                     <Route path="dashboard" element={<AdminDashboard />} />
                     <Route path="users" element={<ManageUsers />} />
                     <Route path="system-data" element={<ManageSystemData />} />
                     <Route path="reports" element={<SystemReports />} />
                     <Route path="bookings" element={<AdminBookings />} /> {/* NEW ROUTE */}
                  </Routes>
                </ProtectedRoute>
              } 
            />

            {/* Agent Routes */}
            <Route 
              path="/agent/*" 
              element={
                <ProtectedRoute allowedRoles={['ROLE_AGENT']}>
                  <Routes>
                     <Route path="dashboard" element={<AgentDashboard />} />
                     <Route path="fleet" element={<ManageFleet />} />
                     <Route path="schedules" element={<ManageSchedules />} />
                     <Route path="bookings" element={<ViewAgentBookings />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />

            {/* Customer Routes */}
            <Route 
              path="/customer/*" 
              element={
                <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                   <Routes>
                     <Route path="dashboard" element={<CustomerDashboard />} />
                     <Route path="search" element={<SearchResults />} />
                     <Route path="book" element={<BookingForm />} />
                     <Route path="my-bookings" element={<MyBookings />} />
                   </Routes>
                </ProtectedRoute>
              } 
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;