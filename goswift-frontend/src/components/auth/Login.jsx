import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(formData.email, formData.password);
      // Role Enum handling
      if (user.role === "ROLE_ADMIN") navigate("/admin/dashboard");
      else if (user.role === "ROLE_AGENT") navigate("/agent/dashboard");
      else navigate("/customer/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "50px" }}>
      <div className="card">
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <p style={{ textAlign: "center", marginBottom: "20px" }}>
          <Link to="/" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>← Back to Home</Link>
        </p>
        {error && <div className="alert alert-danger" style={{color:'red'}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;