/**
 * Validation Utilities
 * Input validation helpers for FHE operations
 */

import { FHEType } from '../fhe/types';

/**
 * Validate value for specific FHE type
 */
export function validateValueForType(value: any, type: FHEType): boolean {
  try {
    switch (type) {
      case 'uint8':
      case 'uint16':
      case 'uint32':
        const num = Number(value);
        return !isNaN(num) && num >= 0 && Number.isInteger(num);

      case 'uint64':
      case 'uint128':
      case 'uint256':
        const bigNum = BigInt(value);
        return bigNum >= 0n;

      case 'bool':
        return typeof value === 'boolean' || value === 'true' || value === 'false';

      case 'address':
        return /^0x[a-fA-F0-9]{40}$/.test(String(value));

      default:
        return false;
    }
  } catch {
    return false;
  }
}

/**
 * Get range for numeric type
 */
export function getTypeRange(type: FHEType): { min: bigint; max: bigint } | null {
  switch (type) {
    case 'uint8':
      return { min: 0n, max: 255n };
    case 'uint16':
      return { min: 0n, max: 65535n };
    case 'uint32':
      return { min: 0n, max: 4294967295n };
    case 'uint64':
      return { min: 0n, max: 18446744073709551615n };
    case 'uint128':
      return { min: 0n, max: (2n ** 128n) - 1n };
    case 'uint256':
      return { min: 0n, max: (2n ** 256n) - 1n };
    default:
      return null;
  }
}

/**
 * Format error message for validation failure
 */
export function getValidationError(value: any, type: FHEType): string {
  const range = getTypeRange(type);

  if (range) {
    return `Value must be between ${range.min} and ${range.max} for type ${type}`;
  }

  if (type === 'bool') {
    return 'Value must be true or false';
  }

  if (type === 'address') {
    return 'Value must be a valid Ethereum address (0x...)';
  }

  return `Invalid value for type ${type}`;
}

/**
 * Parse input value to appropriate type
 */
export function parseValueForType(value: string, type: FHEType): any {
  switch (type) {
    case 'uint8':
    case 'uint16':
    case 'uint32':
      return Number(value);

    case 'uint64':
    case 'uint128':
    case 'uint256':
      return BigInt(value);

    case 'bool':
      return value.toLowerCase() === 'true';

    case 'address':
      return value;

    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

/**
 * Check if encrypted data is valid format
 */
export function isValidEncryptedData(data: any): boolean {
  return data instanceof Uint8Array && data.length > 0;
}
