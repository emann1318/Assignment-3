import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup({ onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    
    onSignup({ email, uid: "new-user-" + Date.now() });
  };

  return (
    <div className="flex-center">
      <div className="card" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: '#666' }}>Join FraudGuard Platform</p>
        
        {error && <div style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@example.com"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 chars"
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary full-width">
            Register Account
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
