/**
 * Security Utilities
 * Security-related helper functions for FHE operations
 */

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input.replace(/[<>'"]/g, '');
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate numeric input for FHE operations
 */
export function isValidNumericInput(value: string, type: string): boolean {
  try {
    const num = BigInt(value);

    switch (type) {
      case 'uint8':
        return num >= 0n && num <= 255n;
      case 'uint16':
        return num >= 0n && num <= 65535n;
      case 'uint32':
        return num >= 0n && num <= 4294967295n;
      case 'uint64':
        return num >= 0n && num <= 18446744073709551615n;
      case 'uint128':
      case 'uint256':
        return num >= 0n;
      default:
        return false;
    }
  } catch {
    return false;
  }
}

/**
 * Hash sensitive data before logging
 */
export function hashForLogging(data: string): string {
  // Simple hash for logging purposes
  return `${data.substring(0, 6)}...${data.substring(data.length - 4)}`;
}

/**
 * Verify signature format
 */
export function isValidSignature(signature: string): boolean {
  return /^0x[a-fA-F0-9]{130}$/.test(signature);
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  check(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];

    // Filter out old requests
    const recentRequests = userRequests.filter(time => now - time < this.windowMs);

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    return true;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}
