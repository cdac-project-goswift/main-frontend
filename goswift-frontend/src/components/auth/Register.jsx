import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "ROLE_CUSTOMER",
    agencyName: ""
  });
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(formData);
      alert("Registration Successful! Please Login.");
      navigate("/login");
    } catch (err) {
      // Extract validation errors if present
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "500px", marginTop: "50px" }}>
      <div className="card">
        <h2 style={{ textAlign: "center" }}>Sign Up</h2>
        <p style={{ textAlign: "center", marginBottom: "20px" }}>
          <Link to="/" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>← Back to Home</Link>
        </p>
        {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
             <div className="form-group">
                <label>First Name</label>
                <input type="text" name="firstName" className="form-control" onChange={handleChange} required />
             </div>
             <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" className="form-control" onChange={handleChange} required />
             </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" className="form-control" onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phoneNumber" className="form-control" onChange={handleChange} required maxLength="15"/>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" className="form-control" onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Role</label>
            <select name="role" className="form-control" onChange={handleChange} value={formData.role}>
              <option value="ROLE_CUSTOMER">Customer</option>
              <option value="ROLE_AGENT">Agent</option>
            </select>
          </div>

          {formData.role === "ROLE_AGENT" && (
            <div className="form-group">
              <label>Travel Agency Name</label>
              <input type="text" name="agencyName" className="form-control" onChange={handleChange} required />
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;