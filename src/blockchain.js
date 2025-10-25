const Block = require('./block');

// نخلّي Transaction داخل نفس الملف لتجنّب أي مشاكل require
class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block(Date.now(), [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  createTransaction(tx) {
    this.pendingTransactions.push(tx); // tx = { fromAddress, toAddress, amount }
  }

  minePendingTransactions(minerAddress) {
    const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);
    this.chain.push(block);

    // نجهّز مكافأة التعدين لتُضاف في البلوك التالي
    this.pendingTransactions = [ new Transaction(null, minerAddress, this.miningReward) ];
    return block;
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      const txs = Array.isArray(block.transactions) ? block.transactions : [];
      for (const tx of txs) {
        if (tx.fromAddress === address) balance -= tx.amount || 0;
        if (tx.toAddress   === address) balance += tx.amount || 0;
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const curr = this.chain[i];
      const prev = this.chain[i - 1];
      if (curr.hash !== curr.calculateHash()) return false;
      if (curr.previousHash !== prev.hash) return false;
    }
    return true;
  }
}

module.exports = Blockchain;
