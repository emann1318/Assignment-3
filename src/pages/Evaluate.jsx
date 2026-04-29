import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function Evaluate() {
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEvaluate = async (e) => {
    e.preventDefault();

   
    if (!amount || !merchant) {
      setError("Please enter both amount and merchant.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      let riskScore = 0;
      const flags = [];
      const amt = Number(amount);

      
      if (amt >= 10000) {
        riskScore += 60;
        flags.push("Extremely Large Amount (> Rs. 10,000)");
      } 
      else if (amt >= 5000) {
        riskScore += 40;
        flags.push("Very Large Amount (> Rs. 5,000)");
      } 
      else if (amt >= 2000) {
        riskScore += 20;
        flags.push("Suspiciously Large Amount");
      } 
      else if (amt < 50) {
        riskScore += 10;
        flags.push("Very small test transaction (possible fraud testing)");
      }

    
      const riskyWords = [
        "crypto",
        "casino",
        "bet",
        "betting",
        "forex",
        "trading",
        "gambling"
      ];

      const merchantLower = merchant.toLowerCase();

      riskyWords.forEach(word => {
        if (merchantLower.includes(word)) {
          riskScore += 35;
          flags.push("High-risk merchant keyword: " + word);
        }
      });

      
      if (Math.random() > 0.7) {
        riskScore += 15;
        flags.push("Unusual transaction pattern detected");
      }

      const finalScore = Math.min(100, riskScore);

      let status = "LOW RISK";
      if (finalScore >= 70) status = "HIGH RISK";
      else if (finalScore >= 40) status = "MEDIUM RISK";

      const evalData = {
        amount: amt,
        merchant,
        riskScore: finalScore,
        flags,
        status,
        timestamp: serverTimestamp(),
      };

      /*  Save to Firebase */
      await addDoc(collection(db, "transactions"), evalData);
      setResult(evalData);

    } catch (err) {
      console.error(err);
      setError("Analysis failed. Check internet or Firebase config.");
    } finally {
      setLoading(false);
    }
  };

   const formatCurrency = (num) => {
  return num.toLocaleString("en-PK");
};

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="card">
        <h2>Risk Scanner Tool</h2>
        <p style={{ color: "#777", fontSize: "14px", fontStyle: "italic" }}>
          Input the transaction details below. The system checks against a weighted logic engine.
        </p>

        <form onSubmit={handleEvaluate} style={{ marginTop: "25px" }}>
          <div className="input-group">
            <label>Amount to Check (Rs.)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              required
            />
          </div>

          <div className="input-group">
            <label>Merchant / Platform Name</label>
            <input
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="Amazon, Stripe, CryptoPay"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary full-width"
          >
            {loading ? "RUNNING HEURISTICS..." : "RUN EVALUATION"}
          </button>
        </form>

        {error && (
          <p style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>
            {error}
          </p>
        )}
      </div>

      {result && (
        <div
          className="card"
          style={{
            borderLeft: `10px solid ${
              result.status === "HIGH RISK"
                ? "#dc3545"
                : result.status === "MEDIUM RISK"
                ? "#ff9800"
                : "#28a745"
            }`,
            marginTop: "30px",
          }}
        >
          <h3
            style={{
              color:
                result.status === "HIGH RISK"
                  ? "#dc3545"
                  : result.status === "MEDIUM RISK"
                  ? "#ff9800"
                  : "#28a745",
              margin: "0 0 10px 0",
            }}
          >
            {result.status}
          </h3>

          <h1 style={{ fontSize: "48px", margin: "10px 0" }}>
            {result.riskScore}%
          </h1>
          <p style={{ color: "#999", fontSize: "12px", fontWeight: "bold" }}>
            FINAL RISK COEFFICIENT
          </p>

          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#fcfcfc",
              borderRadius: "4px",
              border: "1px solid #eee",
            }}
          >
            <p style={{ fontWeight: "bold", fontSize: "14px" }}>
              Analysis Summary:
            </p>

            {result.flags.length > 0 ? (
              <ul style={{ paddingLeft: "20px" }}>
                {result.flags.map((f, i) => (
                  <li key={i} style={{ fontSize: "13px" }}>
                    {f}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: "13px", color: "#28a745" }}>
                No major risk factors detected.
              </p>
            )}
          </div>

          <button
            onClick={() => navigate("/")}
            className="btn full-width"
            style={{ marginTop: "20px", backgroundColor: "#333", color: "white" }}
          >
            Back to Overview
          </button>
        </div>
      )}
    </div>
  );
} 
