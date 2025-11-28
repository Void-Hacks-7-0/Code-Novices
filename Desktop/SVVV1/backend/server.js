const express = require("express");
const fs = require("fs");
const Blockchain = require("./chain");
const { signData } = require("./utils");

const app = express();
app.use(express.json());

// Load private key
const privateKey = fs.readFileSync("private.pem", "utf8");

// Create Blockchain
const ledger = new Blockchain();

/**
 * POST /transaction/add
 */
app.post("/transaction/add", (req, res) => {
  try {
    const { userId, type, category, amount } = req.body;

    if (!userId || !type || !category || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const transaction = {
      userId,
      type,
      category,
      amount,
      timestamp: new Date().toISOString(),
    };

    const hash = JSON.stringify(transaction);
    const signature = signData(hash, privateKey);

    const newBlock = ledger.addBlock(transaction, signature);

    res.json({
      message: "Transaction added to blockchain",
      block: newBlock,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /chain
 */
app.get("/chain", (req, res) => {
  res.json({
    length: ledger.chain.length,
    chain: ledger.chain,
  });
});

/**
 * GET /isValid
 */
app.get("/isValid", (req, res) => {
  res.json({ valid: ledger.isChainValid() });
});
// Start Server
// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
