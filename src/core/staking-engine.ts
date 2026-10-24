import { StakePosition } from "../models/Stake";

export interface WithdrawalResult {
  amountReturned: number;
  penaltyApplied: number;
  unlocked: boolean;
}

export class StakingEngine {
  private stakes: Map<string, StakePosition>;

  private earlyWithdrawalPenalty: number;

  constructor() {
    this.stakes = new Map();

    this.earlyWithdrawalPenalty = 10;
  }

  registerStake(
    stake: StakePosition
  ): void {
    this.stakes.set(
      stake.id,
      stake
    );
  }

  getStake(
    stakeId: string
  ): StakePosition | undefined {
    return this.stakes.get(stakeId);
  }

  getAllStakes(): StakePosition[] {
    return Array.from(
      this.stakes.values()
    );
  }

  calculateTVL(): number {
    let tvl = 0;

    this.stakes.forEach((stake) => {
      if (stake.active) {
        tvl += stake.amount;
      }
    });

    return tvl;
  }

  withdrawStake(
    stakeId: string
  ): WithdrawalResult {
    const stake =
      this.stakes.get(stakeId);

    if (!stake) {
      throw new Error(
        "Stake not found"
      );
    }

    let amountReturned =
      stake.amount;

    let penalty = 0;

    if (!stake.isUnlocked()) {
      penalty =
        (stake.amount *
          this.earlyWithdrawalPenalty) /
        100;

      amountReturned -= penalty;
    }

    stake.closePosition();

    return {
      amountReturned,
      penaltyApplied: penalty,
      unlocked: stake.isUnlocked()
    };
  }

  validateStakeAmount(
    amount: number
  ): boolean {
    return amount > 0;
  }

  updatePenaltyRate(
    percentage: number
  ): void {
    this.earlyWithdrawalPenalty =
      percentage;
  }

  getPenaltyRate(): number {
    return this.earlyWithdrawalPenalty;
  }

  getActiveStakeCount(): number {
    return this.getAllStakes().filter(
      (stake) => stake.active
    ).length;
  }
}

export const stakingEngine =
  new StakingEngine();
