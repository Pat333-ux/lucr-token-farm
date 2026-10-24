export type RewardType =
  | "FARMING"
  | "STAKING"
  | "GOVERNANCE"
  | "REFERRAL"
  | "BONUS";

export type RewardStatus =
  | "PENDING"
  | "APPROVED"
  | "DISTRIBUTED"
  | "FAILED";

export interface Reward {
  id: string;

  farmerId: string;

  stakeId: string;

  amount: number;

  type: RewardType;

  status: RewardStatus;

  transactionHash?: string;

  notes?: string;

  createdAt: Date;

  distributedAt?: Date;
}

export class RewardRecord implements Reward {
  id: string;
  farmerId: string;
  stakeId: string;
  amount: number;
  type: RewardType;
  status: RewardStatus;
  transactionHash?: string;
  notes?: string;
  createdAt: Date;
  distributedAt?: Date;

  constructor(
    id: string,
    farmerId: string,
    stakeId: string,
    amount: number,
    type: RewardType
  ) {
    this.id = id;
    this.farmerId = farmerId;
    this.stakeId = stakeId;
    this.amount = amount;
    this.type = type;

    this.status = "PENDING";

    this.createdAt = new Date();
  }

  approve(): void {
    this.status = "APPROVED";
  }

  distribute(transactionHash: string): void {
    this.status = "DISTRIBUTED";
    this.transactionHash = transactionHash;
    this.distributedAt = new Date();
  }

  fail(reason: string): void {
    this.status = "FAILED";
    this.notes = reason;
  }
}
