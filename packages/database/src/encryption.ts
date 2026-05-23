import crypto from "crypto";

// Use APP_SECRET environment variable or fallback to a dummy secret for dev.
// In production, APP_SECRET should be a 32-character string.
const getSecretKey = () => {
  const secret = process.env.APP_SECRET || "fallback_secret_key_for_dev_mode!";
  // Ensure the key is exactly 32 bytes for AES-256
  return crypto.createHash("sha256").update(secret).digest();
};

const ENCRYPTION_ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts a plain text string using AES-256-GCM
 */
export function encrypt(text: string): string {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, getSecretKey(), iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:encryptedText
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt data");
  }
}

/**
 * Decrypts an encrypted string created by `encrypt()`
 */
export function decrypt(encryptedData: string): string {
  try {
    const parts = encryptedData.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted data format");
    }

    const [ivHex, authTagHex, encryptedText] = parts;
    const iv = Buffer.from(ivHex as string, "hex");
    const authTag = Buffer.from(authTagHex as string, "hex");

    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, getSecretKey(), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText as string, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data");
  }
}
