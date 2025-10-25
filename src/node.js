const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');

const app = express();
app.use(bodyParser.json());
app.use(express.static('Public')); // Serve your dashboard (index.html) from Public folder

// Create blockchain instance
const myChain = new Blockchain();

// Route: general info
app.get('/info', (req, res) => {
  res.send({
    message: '🚀 MyChain node running successfully',
    chainLength: myChain.chain.length,
    lastBlock: myChain.getLatestBlock(),
  });
});

// Route: create new wallet (dummy endpoint for now)
app.get('/wallet', (req, res) => {
  res.send({
    message: 'Wallet created successfully (placeholder)',
  });
});

// Route: mine pending transactions
app.post('/mine', (req, res) => {
  const { minerAddress } = req.body;
  const block = myChain.minePendingTransactions(minerAddress);
  res.send({
    message: '✅ Block mined successfully!',
    block,
  });
});

// Route: add a new transaction
app.post('/transactions/sign', (req, res) => {
  try {
    const { fromAddress, toAddress, amount } = req.body;
    myChain.createTransaction({ fromAddress, toAddress, amount });
    res.send({
      message: '✅ Transaction added to pending list',
      pendingTransactions: myChain.pendingTransactions,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Route: check balance of a wallet
app.get('/balance/:address', (req, res) => {
  const address = req.params.address;
  const balance = myChain.getBalanceOfAddress(address);
  res.send({
    address,
    balance,
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 MyChain node running on port ${PORT}`);
});
