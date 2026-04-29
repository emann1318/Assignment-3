import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(txs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredTransactions = transactions.filter(tx => {
    if (filter === "high") return tx.riskScore > 70;
    if (filter === "low") return tx.riskScore <= 70;
    return true;
  });

  const stats = {
    total: transactions.length,
    highRisk: transactions.filter(t => t.riskScore > 70).length,
    approved: transactions.filter(t => t.riskScore <= 70).length
  };

  return (
    <div>
      <div className="flex" style={{ gap: '20px', marginBottom: '30px' }}>
        <StatCard title="Transactions" val={stats.total} color="#007bff" />
        <StatCard title="High Risk" val={stats.highRisk} color="#dc3545" />
        <StatCard title="Safe" val={stats.approved} color="#28a745" />
      </div>

      <div className="card">
        <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Evaluation Records</h3>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px' }}
          >
            <option value="all">View All</option>
            <option value="high">High Risk Only</option>
            <option value="low">Low Risk Only</option>
          </select>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Merchant Name</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Amount Paid</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Risk Logic Result</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
            ) : filteredTransactions.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No records found.</td></tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #efefef' }}>
                  <td style={{ padding: '12px' }}>{tx.merchant}</td>
                  <td style={{ padding: '12px' }}>Rs. {Number(tx.amount).toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={tx.riskScore > 70 ? "status-high" : "status-low"}>
                      {tx.riskScore}% {tx.riskScore > 70 ? "FLAGGED" : "CLEARED"}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#999' }}>
                    {tx.timestamp?.toDate ? tx.timestamp.toDate().toLocaleDateString() : 'Just now'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, val, color }) {
  return (
    <div className="card" style={{ flex: 1, textAlign: 'center', borderBottom: `4px solid ${color}` }}>
      <p style={{ margin: '0', fontSize: '12px', color: '#777' }}>{title.toUpperCase()}</p>
      <h1 style={{ margin: '10px 0 0 0', color: color }}>{val}</h1>
    </div>
  );
}
