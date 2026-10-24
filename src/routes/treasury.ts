import { Router } from "express";
import { farmEngine } from "../core/farm-engine";

const router = Router();

router.get("/overview", (_req, res) => {
  const rewards = farmEngine.getRewards();
  const stakes = farmEngine.getStakes();

  res.json({
    success: true,
    data: {
      totalValueLocked: farmEngine.getTotalValueLocked(),
      activeStakes: stakes.filter((stake) => stake.active).length,
      totalRewards: rewards.reduce((sum, reward) => sum + reward.amount, 0),
      rewardsCount: rewards.length
    }
  });
});

router.get("/transactions", (_req, res) => {
  res.json({
    success: true,
    data: {
      transactions: [],
      count: 0
    }
  });
});

export default router;
