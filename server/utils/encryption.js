const crypto = require('crypto');

// Encryption key and initialization vector
// In production, these should be stored securely in environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here'; // Must be 32 bytes for AES-256
const IV_LENGTH = 16; // For AES, this is always 16 bytes

/**
 * Encrypts a string value
 * @param {string} text - The text to encrypt
 * @returns {string} - The encrypted text as a hex string with IV prepended
 */
function encrypt(text) {
  if (!text) return text; // Don't encrypt empty values
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  // Return IV + encrypted data as hex string
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Decrypts an encrypted string value
 * @param {string} text - The encrypted text (IV + encrypted data as hex)
 * @returns {string} - The decrypted text
 */
function decrypt(text) {
  if (!text || !text.includes(':')) return text; // Not encrypted or empty
  
  const textParts = text.split(':');
  const iv = Buffer.from(textParts[0], 'hex');
  const encryptedText = Buffer.from(textParts[1], 'hex');
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString();
}

module.exports = {
  encrypt,
  decrypt
};