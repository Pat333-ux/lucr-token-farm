export interface Stake {
  id: string;

  farmerId: string;

  walletAddress: string;

  amount: number;

  apr: number;

  rewardMultiplier: number;

  lockPeriodDays: number;

  startDate: Date;

  unlockDate: Date;

  lastRewardCalculation: Date;

  active: boolean;
}

export class StakePosition implements Stake {
  id: string;
  farmerId: string;
  walletAddress: string;
  amount: number;
  apr: number;
  rewardMultiplier: number;
  lockPeriodDays: number;
  startDate: Date;
  unlockDate: Date;
  lastRewardCalculation: Date;
  active: boolean;

  constructor(
    id: string,
    farmerId: string,
    walletAddress: string,
    amount: number,
    lockPeriodDays: number
  ) {
    this.id = id;
    this.farmerId = farmerId;
    this.walletAddress = walletAddress;
    this.amount = amount;

    this.apr = 10;
    this.rewardMultiplier = 1;

    this.lockPeriodDays = lockPeriodDays;

    this.startDate = new Date();

    this.unlockDate = new Date(
      this.startDate.getTime() +
      lockPeriodDays * 24 * 60 * 60 * 1000
    );

    this.lastRewardCalculation = new Date();

    this.active = true;
  }

  calculateDailyReward(): number {
    const annualReward = (this.amount * this.apr) / 100;

    return (
      (annualReward / 365) *
      this.rewardMultiplier
    );
  }

  isUnlocked(): boolean {
    return new Date() >= this.unlockDate;
  }

  closePosition(): void {
    this.active = false;
  }

  increaseMultiplier(multiplier: number): void {
    this.rewardMultiplier += multiplier;
  }
}
