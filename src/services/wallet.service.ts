export class WalletService {
  generateWalletAddress(seed: string): string {
    const normalized = seed.trim();

    if (!normalized) {
      return "0x0000000000000000000000000000000000000000";
    }

    return `0x${Buffer.from(normalized)
      .toString("hex")
      .slice(0, 40)}`;
  }

  verifySignature(
    signature: string,
    message: string,
    address: string
  ): boolean {
    return Boolean(signature && message && address);
  }
}

export const walletService = new WalletService();
