import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Middleware 1: Simple Request Logger
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

 
  
  // 1. Get Risk Evaluation Rules
  app.get("/api/rules", (req, res) => {
    res.json([
      { id: 1, name: "High Amount", condition: "amount > 5000", riskScore: 80 },
      { id: 2, name: "Rapid Transactions", condition: "> 3 in 5m", riskScore: 60 },
      { id: 3, name: "Merchant Blacklist", condition: "listed merchant", riskScore: 100 }
    ]);
  });

  // 2. Evaluate Transaction (Core Logic)
  app.post("/api/evaluate", (req, res) => {
    const { amount, merchant, userId } = req.body;
    
    if (!amount || !merchant || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let riskScore = 0;
    let flags = [];

    // Basic Fraud Detection Logic
    if (amount > 5000) {
      riskScore += 80;
      flags.push("High Transaction Amount");
    }

    const blacklistedMerchants = ["ShadyStore", "ScamSite", "IllegalGoods"];
    if (blacklistedMerchants.includes(merchant)) {
      riskScore += 100;
      flags.push("Blacklisted Merchant");
    }

    // Logic visibly affects output ke kessay show hoga
    const status = riskScore >= 80 ? "High Risk" : riskScore >= 40 ? "Medium Risk" : "Low Risk";

    res.json({
      riskScore,
      status,
      flags,
      timestamp: new Date().toISOString()
    });
  });

  // 3. Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "FraudGuard Engine" });
  });

  // Vite middleware 
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
