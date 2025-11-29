import mongoose from "mongoose";

const blockSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  timestamp: { type: String, required: true },

  // Transaction object
  transactionData: {
    userId: { type: String, required: true },
    type: { type: String, required: true },   // income, expense, transfer
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: String, required: true }, // ⭐ Transaction time (important)
  },

  previousHash: { type: String, required: true },
  hash: { type: String, required: true },
  signature: { type: String, required: true },
});

// Model
const BlockModel = mongoose.model("Block", blockSchema);

export default BlockModel;
