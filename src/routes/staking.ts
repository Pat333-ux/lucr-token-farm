import { Router } from "express";
import { farmEngine } from "../core/farm-engine";
import { stakingEngine } from "../core/staking-engine";

const router = Router();

router.get("/stakes", (_req, res) => {
  try {
    const stakes = stakingEngine.getAllStakes();

    res.json({
      success: true,
      count: stakes.length,
      data: stakes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve stakes"
    });
  }
});

router.get("/tvl", (_req, res) => {
  try {
    const tvl = stakingEngine.calculateTVL();

    res.json({
      success: true,
      tvl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate TVL"
    });
  }
});

router.post("/stake", (req, res) => {
  try {
    const {
      farmerId,
      amount,
      lockPeriodDays
    } = req.body;

    if (!stakingEngine.validateStakeAmount(amount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid stake amount"
      });
    }

    const stake = farmEngine.createStake(
      farmerId,
      amount,
      lockPeriodDays
    );

    stakingEngine.registerStake(stake);

    res.status(201).json({
      success: true,
      data: stake
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Stake creation failed"
    });
  }
});

router.post("/unstake", (req, res) => {
  try {
    const { stakeId } = req.body;

    const result =
      stakingEngine.withdrawStake(
        stakeId
      );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unstake failed"
    });
  }
});

export default router;
