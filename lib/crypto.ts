import crypto from 'crypto';

// The key must be exactly 32 bytes (256 bits) for AES-256-GCM.
// We fall back to a dummy key in development if not provided, 
// but it's strongly recommended to set TOKEN_ENCRYPTION_KEY in production.
const ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef';
const ALGORITHM = 'aes-256-gcm';

export function encryptToken(text: string): string {
  if (!text) return text;
  
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf-8'), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptToken(encryptedText: string): string {
  if (!encryptedText) return encryptedText;
  
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) return encryptedText; // Probably not encrypted
    
    const [ivHex, authTagHex, encryptedData] = parts;
    
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'utf-8'),
      Buffer.from(ivHex, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Failed to decrypt token:', error);
    return encryptedText; // Return original if decryption fails (e.g. key changed)
  }
}
