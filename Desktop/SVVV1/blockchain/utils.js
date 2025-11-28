// utils.js
const crypto = require("crypto");
const fs = require("fs");

// Load Public & Private Keys
const PRIVATE_KEY = fs.readFileSync("private.pem", "utf8");
const PUBLIC_KEY = fs.readFileSync("public.pem", "utf8");

// Generate SHA256 Hash
function generateHash(data) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

// Sign Transaction/Block Hash
function signData(hash) {
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(hash);
  return signer.sign(PRIVATE_KEY, "hex");
}

// Verify a Transaction/Block's Signature
function verifySignature(hash, signature) {
  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(hash);
  return verifier.verify(PUBLIC_KEY, signature, "hex");
}

module.exports = {
  generateHash,
  signData,
  verifySignature,
};
