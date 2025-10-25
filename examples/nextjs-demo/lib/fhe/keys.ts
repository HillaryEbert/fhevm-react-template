/**
 * FHE Key Management
 * Handles public key retrieval and caching
 */

export interface FHEPublicKey {
  key: string;
  network: string;
  chainId: number;
  timestamp: string;
}

const KEY_CACHE_DURATION = 3600000; // 1 hour in milliseconds
let cachedKey: FHEPublicKey | null = null;
let cacheTimestamp: number = 0;

/**
 * Fetch FHE public key from gateway
 */
export async function fetchPublicKey(chainId: number): Promise<FHEPublicKey> {
  // Check cache first
  const now = Date.now();
  if (cachedKey && (now - cacheTimestamp) < KEY_CACHE_DURATION) {
    return cachedKey;
  }

  try {
    // In production, fetch from actual FHE gateway
    const response = await fetch('/api/keys');
    const data = await response.json();

    if (data.success && data.publicKey) {
      cachedKey = data.publicKey;
      cacheTimestamp = now;
      return data.publicKey;
    }

    throw new Error('Failed to fetch public key');
  } catch (error) {
    throw new Error(`Public key fetch error: ${error}`);
  }
}

/**
 * Validate public key format
 */
export function validatePublicKey(key: string): boolean {
  // Basic validation - in production, perform cryptographic validation
  return key.length > 0;
}

/**
 * Clear cached key (force refresh)
 */
export function clearKeyCache(): void {
  cachedKey = null;
  cacheTimestamp = 0;
}

/**
 * Get cached key if available
 */
export function getCachedKey(): FHEPublicKey | null {
  const now = Date.now();
  if (cachedKey && (now - cacheTimestamp) < KEY_CACHE_DURATION) {
    return cachedKey;
  }
  return null;
}
