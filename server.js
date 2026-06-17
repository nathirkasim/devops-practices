/**
 * server.js
 * Express server that serves the calculator web UI and exposes
 * a small JSON API backed by the same calculator.js logic used
 * by the CLI version (index.js).
 */

const express = require("express");
const path = require("path");
const { calculate } = require("./calculator");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Health check — used by load balancers, uptime monitors,
// Docker HEALTHCHECK, or Kubernetes liveness/readiness probes.
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime_seconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/calculate", (req, res) => {
  const { a, operator, b } = req.body;

  const numA = parseFloat(a);
  const numB = parseFloat(b);

  if (Number.isNaN(numA) || Number.isNaN(numB)) {
    return res.status(400).json({ error: "Both 'a' and 'b' must be valid numbers." });
  }

  try {
    const result = calculate(operator, numA, numB);
    return res.json({ result });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Calculator UI running at http://localhost:${PORT}`);
});
