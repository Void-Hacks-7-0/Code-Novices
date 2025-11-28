const fs = require("fs");
const { signData, generateHash } = require("./utils");
const Blockchain = require("./chain");

const PRIVATE_KEY = fs.readFileSync("private.pem", "utf8");
const PUBLIC_KEY = fs.readFileSync("public.pem", "utf8");

const blockchain = new Blockchain();

// first transaction
const transaction1 = {
  userId: "user1",
  type: "expense",
  category: "Food",
  amount: 500,
  timestamp: new Date().toISOString()
};

const hash1 = generateHash(transaction1);
const signature1 = signData(hash1, PRIVATE_KEY);

blockchain.addBlock(transaction1, signature1);
console.log("Added Block:", blockchain.getLatestBlock());
console.log("Valid?", blockchain.isChainValid());
console.log("Full Chain:", blockchain.chain);
