import { v4 as uuidv4 } from "uuid";

import { FarmerAccount } from "../models/Farmer";
import { StakePosition } from "../models/Stake";
import { RewardRecord } from "../models/Reward";

export class FarmEngine {
  private farmers: Map<string, FarmerAccount>;
  private stakes: Map<string, StakePosition>;
  private rewards: Map<string, RewardRecord>;

  constructor() {
    this.farmers = new Map();
    this.stakes = new Map();
    this.rewards = new Map();
  }

  registerFarmer(
    walletAddress: string,
    memberId: string,
    username: string
  ): FarmerAccount {
    const farmer = new FarmerAccount(
      uuidv4(),
      walletAddress,
      memberId,
      username
    );

    this.farmers.set(farmer.id, farmer);

    return farmer;
  }

  createStake(
    farmerId: string,
    amount: number,
    lockPeriodDays: number
  ): StakePosition {
    const farmer = this.farmers.get(farmerId);

    if (!farmer) {
      throw new Error("Farmer not found");
    }

    const stake = new StakePosition(
      uuidv4(),
      farmer.id,
      farmer.walletAddress,
      amount,
      lockPeriodDays
    );

    farmer.addStake(amount);

    this.stakes.set(stake.id, stake);

    return stake;
  }

  calculateRewards(): RewardRecord[] {
    const generatedRewards: RewardRecord[] = [];

    this.stakes.forEach((stake) => {
      if (!stake.active) {
        return;
      }

      const rewardAmount =
        stake.calculateDailyReward();

      const reward = new RewardRecord(
        uuidv4(),
        stake.farmerId,
        stake.id,
        rewardAmount,
        "FARMING"
      );

      generatedRewards.push(reward);

      this.rewards.set(
        reward.id,
        reward
      );

      const farmer = this.farmers.get(
        stake.farmerId
      );

      if (farmer) {
        farmer.addRewards(rewardAmount);
      }
    });

    return generatedRewards;
  }

  harvestRewards(
    farmerId: string
  ): number {
    const farmer = this.farmers.get(
      farmerId
    );

    if (!farmer) {
      throw new Error("Farmer not found");
    }

    return farmer.harvestRewards();
  }

  getFarmer(
    farmerId: string
  ): FarmerAccount | undefined {
    return this.farmers.get(farmerId);
  }

  getFarmers(): FarmerAccount[] {
    return Array.from(
      this.farmers.values()
    );
  }

  getStakes(): StakePosition[] {
    return Array.from(
      this.stakes.values()
    );
  }

  getRewards(): RewardRecord[] {
    return Array.from(
      this.rewards.values()
    );
  }

  getTotalValueLocked(): number {
    let tvl = 0;

    this.stakes.forEach((stake) => {
      if (stake.active) {
        tvl += stake.amount;
      }
    });

    return tvl;
  }
}

export const farmEngine =
  new FarmEngine();
