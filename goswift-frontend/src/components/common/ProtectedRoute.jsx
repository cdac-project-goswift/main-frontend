import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if role matches (if specific roles are required)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="container card" style={{marginTop: '20px', textAlign: 'center'}}>
        <h2 style={{color: 'red'}}>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
        <p>Your Role: {user.role}</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;