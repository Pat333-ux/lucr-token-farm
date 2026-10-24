import { Router } from "express";
import { farmEngine } from "../core/farm-engine";

const router = Router();

router.get("/", (_req, res) => {
  try {
    const rewards = farmEngine.getRewards();

    res.json({
      success: true,
      count: rewards.length,
      data: rewards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve rewards"
    });
  }
});

router.post("/calculate", (_req, res) => {
  try {
    const rewards = farmEngine.calculateRewards();

    res.json({
      success: true,
      generated: rewards.length,
      data: rewards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Reward calculation failed"
    });
  }
});

router.post("/harvest", (req, res) => {
  try {
    const { farmerId } = req.body;

    const harvestedAmount = farmEngine.harvestRewards(farmerId);

    res.json({
      success: true,
      harvestedAmount
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Harvest failed"
    });
  }
});

router.get("/pending/:farmerId", (req, res) => {
  try {
    const farmer = farmEngine.getFarmer(req.params.farmerId);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found"
      });
    }

    res.json({
      success: true,
      farmerId: farmer.id,
      pendingRewards: farmer.pendingRewards,
      harvestedRewards: farmer.harvestedRewards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve rewards"
    });
  }
});

export default router;
