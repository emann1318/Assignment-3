import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (email === "admin@fraudguard.com" && password === "password123") {
      onLogin({ email, uid: "hardcoded-admin-123456" });
    } else {
      setError("Invalid credentials! Try email: admin@fraudguard.com, pass: password123456");
    }
  };

  return (
    <div className="flex-center">
      <div className="card" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center' }}>FraudGuard Login</h2>
        <p style={{ textAlign: 'center', color: '#666' }}>Sign in to continue</p>
        
        {error && <div style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@fraudguard.com"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. password123"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary full-width">
            Sign In
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          Don't have an account? <Link to="/signup">Signup Here</Link>
        </p>
      </div>
    </div>
  );
}
