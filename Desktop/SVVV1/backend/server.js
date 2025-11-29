import express from "express";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import { Blockchain } from "../blockchain/chain.js";
import { signData, verifySignature } from "../blockchain/utils.js";
import BlockModel from "./Block.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Load private key for signing transactions
const privateKey = fs.readFileSync("../blockchain/private.pem", "utf-8");

// Blockchain instance (in RAM)
const ledger = new Blockchain();

/* ----------------------------------------------------------
    SYNC BLOCKCHAIN FROM DATABASE ON SERVER START
-----------------------------------------------------------*/
const syncChain = async () => {
  try {
    const blocks = await BlockModel.find().sort({ index: 1 });

    if (blocks.length === 0) {
      console.log("⚠ No blockchain found in DB. Starting fresh...");
      return;
    }

    // Rebuild blockchain object structure
    ledger.chain = blocks.map((b) => ({
      index: b.index,
      timestamp: b.timestamp,
      transactionData: b.transactionData,
      previousHash: b.previousHash,
      hash: b.hash,
      signature: b.signature,
    }));

    console.log("✅ Blockchain restored from Database");
  } catch (error) {
    console.error("❌ Blockchain sync error:", error);
  }
};

syncChain();

/* ----------------------------------------------------------
    POST /transaction/add → Add Block API
-----------------------------------------------------------*/
app.post("/transaction/add", async (req, res) => {
  try {
    const { userId, type, category, amount } = req.body;

    if (!userId || !type || !category || !amount) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create transaction object
    const transaction = {
      userId,
      type,
      category,
      amount,
      timestamp: new Date().toISOString(),
    };

    // Sign transaction
    const dataToSign = JSON.stringify(transaction);
    const signature = signData(dataToSign, privateKey);

    // OPTIONAL: Verify signature before adding
    const isValidSignature = verifySignature(dataToSign, signature);
    if (!isValidSignature) {
      return res.status(400).json({ error: "Signature verification failed" });
    }

    // Add block in RAM blockchain
    const newBlock = ledger.addBlock(transaction, signature);

    // Prevent duplicate blocks in DB
    const exists = await BlockModel.findOne({ hash: newBlock.hash });
    if (exists) {
      return res.status(400).json({ error: "Block already exists" });
    }

    // Save block to MongoDB
    await BlockModel.create(newBlock);

    return res.json({
      success: true,
      message: "Block added to blockchain + database",
      block: newBlock,
    });
  } catch (err) {
    console.error("Transaction Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ----------------------------------------------------------
    GET /chain → Full Blockchain from DB
-----------------------------------------------------------*/
app.get("/chain", async (req, res) => {
  const chain = await BlockModel.find().sort({ index: 1 });
  res.json({
    length: chain.length,
    chain,
  });
});

/* ----------------------------------------------------------
    GET /isValid → Validate Blockchain
-----------------------------------------------------------*/
app.get("/isValid", (req, res) => {
  res.json({
    valid: ledger.isChainValid(),
  });
});

/* ----------------------------------------------------------
    SERVER LISTEN
-----------------------------------------------------------*/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
