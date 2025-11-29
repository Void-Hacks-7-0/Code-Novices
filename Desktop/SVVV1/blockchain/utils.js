import crypto from "crypto";

// 1. Hash generate karne ke liye
export function generateHash(data) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
}

// 2. Data Sign karne ke liye (Private Key Server se aayegi)
export function signData(data, privateKey) {
  const signer = crypto.createSign("SHA256");
  signer.update(data);
  signer.end();
  return signer.sign(privateKey, "hex");
}

// 3. Signature Verify karne ke liye (Public Key argument mein lenge)
export function verifySignature(data, signature, publicKey) {
  const verifier = crypto.createVerify("SHA256");
  verifier.update(data);
  verifier.end();
  return verifier.verify(publicKey, signature, "hex");
}