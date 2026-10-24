import { Router } from "express";
import { farmEngine } from "../core/farm-engine";
import { governanceService } from "../services/governance.service";

const router = Router();

router.get("/status", (_req, res) => {
  const farmers = farmEngine.getFarmers();

  res.json({
    success: true,
    data: {
      active: true,
      totalFarmers: farmers.length,
      totalGovernancePower: farmers.reduce(
        (sum, farmer) => sum + governanceService.calculateGovernancePower(farmer),
        0
      )
    }
  });
});

router.get("/power/:farmerId", (req, res) => {
  const farmer = farmEngine.getFarmer(req.params.farmerId);

  if (!farmer) {
    return res.status(404).json({
      success: false,
      message: "Farmer not found"
    });
  }

  res.json({
    success: true,
    data: {
      farmerId: farmer.id,
      governancePower: governanceService.calculateGovernancePower(farmer),
      canParticipate: governanceService.canParticipate(farmer)
    }
  });
});

export default router;
