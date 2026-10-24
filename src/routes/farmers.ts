import { Router } from "express";
import { farmEngine } from "../core/farm-engine";

const router = Router();

router.post("/register", (req, res) => {
  try {
    const { walletAddress, memberId, username } = req.body;

    if (!walletAddress || !memberId || !username) {
      return res.status(400).json({
        success: false,
        message: "walletAddress, memberId, and username are required"
      });
    }

    const farmer = farmEngine.registerFarmer(
      walletAddress,
      memberId,
      username
    );

    res.status(201).json({
      success: true,
      data: farmer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Farmer registration failed"
    });
  }
});

router.get("/", (_req, res) => {
  try {
    const farmers = farmEngine.getFarmers();

    res.json({
      success: true,
      count: farmers.length,
      data: farmers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve farmers"
    });
  }
});

router.get("/:id", (req, res) => {
  try {
    const farmer = farmEngine.getFarmer(req.params.id);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found"
      });
    }

    res.json({
      success: true,
      data: farmer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve farmer"
    });
  }
});

router.get("/:id/dashboard", (req, res) => {
  try {
    const farmer = farmEngine.getFarmer(req.params.id);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found"
      });
    }

    res.json({
      success: true,
      data: {
        profile: farmer,
        totalStaked: farmer.totalStaked,
        pendingRewards: farmer.pendingRewards,
        harvestedRewards: farmer.harvestedRewards,
        governancePower: farmer.governancePower,
        farmLevel: farmer.farmLevel
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve farmer dashboard"
    });
  }
});

export default router;
