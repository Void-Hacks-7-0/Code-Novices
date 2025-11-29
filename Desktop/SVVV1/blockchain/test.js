import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { signData, generateHash } from "./utils.js";
import { Blockchain } from "./chain.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Load keys
const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, "../keys/private.pem"), "utf8");
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, "../keys/public.pem"), "utf8"); // Not used but kept for future

// Create blockchain instance
const blockchain = new Blockchain();

// First transaction
const transaction1 = {
  userId: "user1",
  type: "expense",
  category: "Food",
  amount: 500,
  timestamp: new Date().toISOString()
};

const hash1 = generateHash(transaction1);
const signature1 = ""; // Skip signing for now

// Add block
blockchain.addBlock(transaction1, signature1);

// Print results
console.log("Added Block:", blockchain.getLatestBlock());
console.log("Valid?", blockchain.isChainValid());
console.log("Full Chain:", blockchain.chain);
