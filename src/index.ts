import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import stakingRoutes from "./routes/staking";
import rewardsRoutes from "./routes/rewards";
import farmersRoutes from "./routes/farmers";
import governanceRoutes from "./routes/governance";
import treasuryRoutes from "./routes/treasury";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/staking", stakingRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/farmers", farmersRoutes);
app.use("/api/governance", governanceRoutes);
app.use("/api/treasury", treasuryRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.json({
    project: "LUCR Token Farm",
    version: "1.0.0",
    status: "online"
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

app.get("/farm/info", (_req, res) => {
  res.json({
    token: "LUCR",
    rewardRate: process.env.REWARD_RATE || "0",
    stakingEnabled: true,
    governanceEnabled: true
  });
});

app.listen(PORT, () => {
  console.log(`LUCR Farm API running on port ${PORT}`);
});

export default app;
