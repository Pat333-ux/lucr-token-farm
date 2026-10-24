import { StakePosition } from "../models/Stake";

export interface RewardPolicy {
  baseApr: number;
  governanceBonus: number;
  referralBonus: number;
  longTermBonus: number;
}

export class RewardEngine {
  private policy: RewardPolicy;

  constructor() {
    this.policy = {
      baseApr: 10,
      governanceBonus: 2,
      referralBonus: 1,
      longTermBonus: 3
    };
  }

  calculateDailyReward(
    stake: StakePosition
  ): number {
    const annualReward =
      (stake.amount *
        this.getEffectiveApr(stake)) /
      100;

    return annualReward / 365;
  }

  getEffectiveApr(
    stake: StakePosition
  ): number {
    return (
      this.policy.baseApr *
      stake.rewardMultiplier
    );
  }

  calculateGovernanceBonus(
    amount: number
  ): number {
    return (
      amount *
      (this.policy.governanceBonus /
        100)
    );
  }

  calculateReferralBonus(
    amount: number
  ): number {
    return (
      amount *
      (this.policy.referralBonus /
        100)
    );
  }

  calculateLongTermBonus(
    amount: number,
    daysLocked: number
  ): number {
    if (daysLocked < 90) {
      return 0;
    }

    return (
      amount *
      (this.policy.longTermBonus /
        100)
    );
  }

  calculateHarvestAmount(
    pendingRewards: number,
    governanceEligible: boolean,
    referralEligible: boolean,
    daysLocked: number
  ): number {
    let reward = pendingRewards;

    if (governanceEligible) {
      reward +=
        this.calculateGovernanceBonus(
          pendingRewards
        );
    }

    if (referralEligible) {
      reward +=
        this.calculateReferralBonus(
          pendingRewards
        );
    }

    reward += this.calculateLongTermBonus(
      pendingRewards,
      daysLocked
    );

    return Number(
      reward.toFixed(8)
    );
  }

  updatePolicy(
    policy: Partial<RewardPolicy>
  ): void {
    this.policy = {
      ...this.policy,
      ...policy
    };
  }

  getPolicy(): RewardPolicy {
    return this.policy;
  }
}

export const rewardEngine =
  new RewardEngine();
