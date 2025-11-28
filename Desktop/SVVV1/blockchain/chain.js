const { generateHash } = require("./utils");

class Block {
  constructor(index, transactionData, previousHash = "", signature = "") {
    this.index = index;
    this.timestamp = new Date().toISOString();
    this.transactionData = transactionData;
    this.previousHash = previousHash;
    this.signature = signature; // NEW FIELD
    this.hash = this.calculateHash();
  }

  // ✔ Correctly placed inside the class
  calculateHash() {
    return generateHash({
      index: this.index,
      timestamp: this.timestamp,
      transactionData: this.transactionData,
      previousHash: this.previousHash,
      signature: this.signature // Include signature in hash
    });
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "Genesis Block", "0", "");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(transaction, signature) {
    const newBlock = new Block(
      this.chain.length,
      transaction,
      this.getLatestBlock().hash,
      signature
    );
    this.chain.push(newBlock);
    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.hash !== current.calculateHash()) return false;
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }
}

module.exports = Blockchain;
