import crypto from "crypto";

export function encrypt(text: string, secret: string): string {
  const key = crypto.scryptSync(secret, "salt", 32);

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string, secret: string): string {
  const key = crypto.scryptSync(secret, "salt", 32);

  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift() || "", "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");

  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
