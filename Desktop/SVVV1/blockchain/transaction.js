class Transaction {
  constructor(userId, type, category, amount, timestamp) {
    this.userId = userId;           // e.g., user1
    this.type = type;               // income / expense
    this.category = category;       // food / travel / education
    this.amount = amount;           // numeric
    this.timestamp = timestamp;     // ISO string
  }
}

module.exports = Transaction;
