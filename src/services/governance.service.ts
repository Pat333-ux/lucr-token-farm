import { FarmerAccount } from "../models/Farmer";

export class GovernanceService {
  calculateGovernancePower(farmer: FarmerAccount): number {
    return (
      farmer.governancePower +
      Math.max(0, Math.floor(farmer.totalStaked / 1000))
    );
  }

  canParticipate(farmer: FarmerAccount): boolean {
    return farmer.active && farmer.governancePower > 0;
  }
}

export const governanceService = new GovernanceService();
