export interface BlockchainStatus {
  network: string;
  blockNumber: number;
  synced: boolean;
}

export class BlockchainService {
  private blockNumber = 1;

  async getStatus(): Promise<BlockchainStatus> {
    return {
      network: "LUCR",
      blockNumber: this.blockNumber,
      synced: true
    };
  }

  async submitTransaction(
    txHash: string
  ): Promise<{ txHash: string; status: "submitted" | "pending" | "confirmed" }> {
    this.blockNumber += 1;

    return {
      txHash,
      status: "submitted"
    };
  }
}

export const blockchainService = new BlockchainService();
