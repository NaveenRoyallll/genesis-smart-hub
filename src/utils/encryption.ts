
/**
 * Simple encryption utility for end-to-end encryption
 * 
 * In a production environment, this should be replaced with a proper
 * cryptography library like TweetNaCl.js or Web Crypto API
 */

/**
 * Generates a random encryption key
 * @returns A random 32-character hex string
 */
export const generateEncryptionKey = (): string => {
  return Array(32)
    .fill(0)
    .map(() => Math.round(Math.random() * 15).toString(16))
    .join('');
};

/**
 * Simple XOR-based encryption (for demonstration purposes only)
 * In production, use proper encryption libraries
 * 
 * @param text The text to encrypt
 * @param key The encryption key
 * @returns Encrypted text as a hex string
 */
export const encryptData = (text: string, key: string): string => {
  if (!key) return text; // No encryption if no key provided
  
  // Convert text to array of character codes
  const textChars = text.split('').map(c => c.charCodeAt(0));
  
  // Generate key character codes (repeat key if necessary)
  const keyChars = [];
  for (let i = 0; i < textChars.length; i++) {
    const keyChar = key.charCodeAt(i % key.length);
    keyChars.push(keyChar);
  }
  
  // XOR text with key and convert to hex
  return textChars
    .map((char, i) => {
      const result = char ^ keyChars[i];
      return result.toString(16).padStart(2, '0');
    })
    .join('');
};

/**
 * Simple XOR-based decryption (for demonstration purposes only)
 * In production, use proper encryption libraries
 * 
 * @param encryptedHex The encrypted text as a hex string
 * @param key The encryption key
 * @returns Decrypted text
 */
export const decryptData = (encryptedHex: string, key: string): string => {
  if (!key) return encryptedHex; // No decryption if no key provided
  
  // Convert hex to array of numbers
  const encryptedChars = [];
  for (let i = 0; i < encryptedHex.length; i += 2) {
    const hex = encryptedHex.substring(i, i + 2);
    encryptedChars.push(parseInt(hex, 16));
  }
  
  // Generate key character codes (repeat key if necessary)
  const keyChars = [];
  for (let i = 0; i < encryptedChars.length; i++) {
    const keyChar = key.charCodeAt(i % key.length);
    keyChars.push(keyChar);
  }
  
  // XOR encrypted chars with key to get original text
  return encryptedChars
    .map((char, i) => String.fromCharCode(char ^ keyChars[i]))
    .join('');
};

/**
 * Store encrypted data in localStorage
 * 
 * @param key The storage key
 * @param value The value to store
 * @param encryptionKey The encryption key (optional)
 */
export const secureStore = (key: string, value: any, encryptionKey?: string): void => {
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
  const storedValue = encryptionKey 
    ? encryptData(stringValue, encryptionKey)
    : stringValue;
    
  localStorage.setItem(key, storedValue);
};

/**
 * Retrieve and decrypt data from localStorage
 * 
 * @param key The storage key
 * @param encryptionKey The encryption key (optional)
 * @returns The decrypted value, or null if not found
 */
export const secureRetrieve = (key: string, encryptionKey?: string): any => {
  const storedValue = localStorage.getItem(key);
  if (!storedValue) return null;
  
  const decryptedValue = encryptionKey
    ? decryptData(storedValue, encryptionKey)
    : storedValue;
    
  try {
    return JSON.parse(decryptedValue);
  } catch {
    return decryptedValue;
  }
};
