import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface StorageAdapter {
  upload(file: Buffer, filename: string): Promise<string>;
  delete(url: string): Promise<void>;
  getPath(url: string): string;
}

class LocalStorageAdapter implements StorageAdapter {
  private uploadDir: string;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
  }

  async upload(file: Buffer, filename: string): Promise<string> {
    // Ensure upload directory exists
    await fs.mkdir(this.uploadDir, { recursive: true });

    // Generate unique filename
    const ext = path.extname(filename);
    const uniqueName = `${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadDir, uniqueName);

    await fs.writeFile(filePath, file);

    // Return relative URL for serving
    return `/api/uploads/${uniqueName}`;
  }

  async delete(url: string): Promise<void> {
    const filename = url.replace('/api/uploads/', '');
    const filePath = path.join(this.uploadDir, filename);
    
    try {
      await fs.unlink(filePath);
    } catch {
      // File may not exist, ignore
    }
  }

  getPath(url: string): string {
    const filename = url.replace('/api/uploads/', '');
    return path.join(this.uploadDir, filename);
  }
}

// Singleton
let storageInstance: StorageAdapter | null = null;

export function getStorage(): StorageAdapter {
  if (!storageInstance) {
    // In the future, check env for S3/Supabase config and return appropriate adapter
    storageInstance = new LocalStorageAdapter();
  }
  return storageInstance;
}
