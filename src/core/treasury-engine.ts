export interface TreasuryAllocation {
  farmingPool: number;
  daoReserve: number;
  buybackReserve: number;
  emergencyReserve: number;
}

export interface TreasuryTransaction {
  id: string;
  type: string;
  amount: number;
  timestamp: Date;
  description: string;
}

export class TreasuryEngine {
  private totalTreasury: number;

  private allocations: TreasuryAllocation;

  private transactions: TreasuryTransaction[];

  constructor() {
    this.totalTreasury = 0;

    this.allocations = {
      farmingPool: 0,
      daoReserve: 0,
      buybackReserve: 0,
      emergencyReserve: 0
    };

    this.transactions = [];
  }

  deposit(
    amount: number,
    description = "Treasury Deposit"
  ): void {
    this.totalTreasury += amount;

    this.recordTransaction(
      "DEPOSIT",
      amount,
      description
    );
  }

  allocateFunds(): void {
    this.allocations.farmingPool =
      this.totalTreasury * 0.5;

    this.allocations.daoReserve =
      this.totalTreasury * 0.2;

    this.allocations.buybackReserve =
      this.totalTreasury * 0.15;

    this.allocations.emergencyReserve =
      this.totalTreasury * 0.15;
  }

  distributeReward(
    amount: number
  ): boolean {
    if (
      this.allocations.farmingPool <
      amount
    ) {
      return false;
    }

    this.allocations.farmingPool -=
      amount;

    this.recordTransaction(
      "REWARD_DISTRIBUTION",
      amount,
      "Farmer Reward Payment"
    );

    return true;
  }

  executeBuyback(
    amount: number
  ): boolean {
    if (
      this.allocations.buybackReserve <
      amount
    ) {
      return false;
    }

    this.allocations.buybackReserve -=
      amount;

    this.recordTransaction(
      "BUYBACK",
      amount,
      "LUCR Token Buyback"
    );

    return true;
  }

  useEmergencyReserve(
    amount: number
  ): boolean {
    if (
      this.allocations.emergencyReserve <
      amount
    ) {
      return false;
    }

    this.allocations.emergencyReserve -=
      amount;

    this.recordTransaction(
      "EMERGENCY",
      amount,
      "Emergency Reserve Usage"
    );

    return true;
  }

  private recordTransaction(
    type: string,
    amount: number,
    description: string
  ): void {
    this.transactions.push({
      id: crypto.randomUUID(),
      type,
      amount,
      timestamp: new Date(),
      description
    });
  }

  getTreasuryBalance(): number {
    return this.totalTreasury;
  }

  getAllocations(): TreasuryAllocation {
    return this.allocations;
  }

  getTransactions(): TreasuryTransaction[] {
    return this.transactions;
  }
}

export const treasuryEngine =
  new TreasuryEngine();
