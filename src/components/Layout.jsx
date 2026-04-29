import { Outlet, Link } from "react-router-dom";

export default function Layout({ user, onLogout }) {
  return (
    <div 
      style={{ 
        display: "flex",
        minHeight: "100vh",
        background: "#ffffff"
      }}
    >
      
      {/* Sidebar */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          width: "250px",
          padding: "30px 20px",
          minHeight: "100vh",

         
          background: "#4B0082",
          color: "white",
          boxShadow: "4px 0 25px rgba(0,0,0,0.15)"

        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "50px" }}>
          <h1 style={{ margin: 0, fontSize: "32px", letterSpacing: "-1px" }}>
            FraudGuard
          </h1>
        </div>

        {/* Navigation Links */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            flexGrow: 1
          }}
        >
          
          <Link 
            to="/" 
            style={{
              color: "#e0d7ff",
              textDecoration: "none",
              fontSize: "20px",
              fontWeight: "600"
            }}
          >
            Dashboard
          </Link>

          <Link 
            to="/evaluate" 
            style={{
              color: "#e0d7ff",
              textDecoration: "none",
              fontSize: "20px",
              fontWeight: "600"
            }}
          >
            Risk Evaluator
          </Link>
        </div>

        {/* User Section */}
        <div
          style={{
            marginTop: "auto",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            paddingTop: "20px"
          }}
        >
          <p style={{ fontSize: "12px", marginBottom: "10px" }}>
            User: {user?.email}
          </p>

          <button
            onClick={onLogout}
            style={{
              width: "100%",
              padding: "10px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#ff4d6d",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main
        style={{
          flexGrow: 1,
          padding: "25px"
        }}
      >
        {/* Header Card */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            padding: "22px",

            /* soft purple card */
            background: "white",
            borderRadius: "14px",
            boxShadow: "0 8px 25px rgba(123,63,228,0.15)"
          }}
        >
          <h2 style={{ margin: 0, fontSize: "26px", color: "#2b0a3d" }}>
            Fraud Risk System
          </h2>

          <span
            style={{
              fontSize: "11px",
              padding: "6px 10px",
              backgroundColor: "#efe7ff",
              color: "#5a2bcf",
              borderRadius: "6px",
              fontWeight: "bold"
            }}
          >
            ENGINE ONLINE
          </span>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
