export interface Farmer {
  id: string;

  walletAddress: string;

  memberId: string;

  username: string;

  totalStaked: number;

  pendingRewards: number;

  harvestedRewards: number;

  governancePower: number;

  farmLevel: number;

  createdAt: Date;

  updatedAt: Date;

  active: boolean;
}

export class FarmerAccount implements Farmer {
  id: string;
  walletAddress: string;
  memberId: string;
  username: string;
  totalStaked: number;
  pendingRewards: number;
  harvestedRewards: number;
  governancePower: number;
  farmLevel: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;

  constructor(
    id: string,
    walletAddress: string,
    memberId: string,
    username: string
  ) {
    this.id = id;
    this.walletAddress = walletAddress;
    this.memberId = memberId;
    this.username = username;

    this.totalStaked = 0;
    this.pendingRewards = 0;
    this.harvestedRewards = 0;

    this.governancePower = 1;
    this.farmLevel = 1;

    this.createdAt = new Date();
    this.updatedAt = new Date();

    this.active = true;
  }

  addStake(amount: number): void {
    this.totalStaked += amount;
    this.updatedAt = new Date();
  }

  addRewards(amount: number): void {
    this.pendingRewards += amount;
    this.updatedAt = new Date();
  }

  harvestRewards(): number {
    const rewards = this.pendingRewards;

    this.harvestedRewards += rewards;
    this.pendingRewards = 0;
    this.updatedAt = new Date();

    return rewards;
  }

  increaseGovernancePower(amount: number): void {
    this.governancePower += amount;
    this.updatedAt = new Date();
  }
}
