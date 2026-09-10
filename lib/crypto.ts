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

// ──────────────────────────────────────────────
// Per-User API Key Encryption (AES-256-GCM)
// Uses ENCRYPTION_SECRET from environment
// ──────────────────────────────────────────────

const GCM_ALGORITHM = 'aes-256-gcm';

function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET || process.env.TOKEN_ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  // Use first 32 bytes of the hex string
  const hex = secret.replace(/[^a-fA-F0-9]/g, '').slice(0, 64).padEnd(64, '0');
  return Buffer.from(hex, 'hex');
}

export interface EncryptedPayload {
  encrypted: string; // hex
  iv: string;        // hex
  authTag: string;   // hex
}

export function encryptApiKey(plaintext: string): EncryptedPayload {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(GCM_ALGORITHM, key, iv);

  const encryptedBuf = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return {
    encrypted: encryptedBuf.toString('hex'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

export function decryptApiKey(payload: EncryptedPayload): string {
  const key = getEncryptionKey();
  const decipher = crypto.createDecipheriv(
    GCM_ALGORITHM,
    key,
    Buffer.from(payload.iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(payload.authTag, 'hex'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.encrypted, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}

/** Tạo hint để hiển thị: ••••••••XXXX (4 ký tự cuối) */
export function makeKeyHint(plaintext: string): string {
  if (!plaintext || plaintext.length <= 4) return '••••';
  return `••••••••${plaintext.slice(-4)}`;
}
