import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ROBUST FIX: Check if user exists and 
  // role is a string before calling replace

  const getRoleDisplay = () => {
    if (!user || !user.role) return '';

    // If role is an object (Scenario B), 
    // try accessing a property like name or roleName
    if (typeof user.role === 'object') {
        return user.role.roleName?.replace('ROLE_', '') || user.role.name || '';
    }

    // If role is a string (Scenario A)

    return String(user.role).replace('ROLE_', '');
  };



  return (
    <nav className="navbar">

      <div className="navbar-brand">
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>GoSWIFT</Link>
      </div>

      <ul className="navbar-nav">

        {!user ? (
          <>
            <li><Link to="/login" className="nav-link">Login</Link></li>
            <li><Link to="/signup" className="nav-link">Sign Up</Link></li>
          </>
        ) : (
          <>
            {String(user.role) === 'ROLE_ADMIN' && <li><Link to="/admin/dashboard" className="nav-link">Dashboard</Link></li>}
            {String(user.role) === 'ROLE_AGENT' && <li><Link to="/agent/dashboard" className="nav-link">Dashboard</Link></li>}
            {String(user.role) === 'ROLE_CUSTOMER' && (
              <>
                <li><Link to="/customer/dashboard" className="nav-link">Dashboard</Link></li>
                <li><Link to="/customer/my-bookings" className="nav-link">My Bookings</Link></li>
              </>
            )}
            
            <li><Link to="/profile" className="nav-link">Profile</Link></li>

            <li>
              <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '5px 10px' }}>Logout</button>
            </li>

          </>
        )}
      </ul>
    </nav>
  );
    };

export default Navbar;










