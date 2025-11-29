import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import Blockchain from "./chain.js";   // .js extension zaruri
import Transaction from "./transaction.js";       // .js extension zaruri
import { signData } from "./utils.js";           // .js extension zaruri

const privateKey = fs.readFileSync("./private.pem", "utf-8");

const app = express();
app.use(bodyParser.json());

const blockchain = new Blockchain();

// POST /transaction/add
app.post("/transaction/add", (req, res) => {
  const { userId, type, category, amount } = req.body;

  if (!userId || !type || !category || !amount) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const transaction = new Transaction(userId, type, category, amount);

  // Sign transaction
  const signature = signData(transaction, privateKey);

  // Add block
  const newBlock = blockchain.addBlock(transaction, signature);

  res.json({ message: "Transaction added", block: newBlock });
});

// GET /chain
app.get("/chain", (req, res) => {
  res.json(blockchain.chain);
});

// GET /isValid
app.get("/isValid", (req, res) => {
  const valid = blockchain.isChainValid();
  res.json({ valid });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
