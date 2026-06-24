const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { validationResult } = require('express-validator');
const {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getRecentTransactionsByUser,
} = require('../models/transactionModel');
const { encrypt, decrypt } = require('../services/encryptionService');
const { detectFraud } = require('../services/fraudEngine');

const fetchTransactions = async (req, res, next) => {
  try {
    const transactions = await getAllTransactions();
    const decrypted = transactions.map((tx) => ({
      ...tx,
      decrypted_amount: decrypt(tx.encrypted_value) || tx.amount,
    }));
    res.json({ transactions: decrypted });
  } catch (error) {
    console.error('fetchTransactions error:', error);
    next(error);
  }
};

const fetchTransaction = async (req, res, next) => {
  try {
    const transaction = await getTransactionById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    transaction.decrypted_amount = decrypt(transaction.encrypted_value) || transaction.amount;
    res.json({ transaction });
  } catch (error) {
    console.error('fetchTransaction error:', error);
    next(error);
  }
};

const buildTransactionPayload = (body, userId) => ({
  bank_id: Number(body.bank_id) || 1,
  user_id: userId,
  account_number: body.account_number || `ACCT-${Date.now()}`,
  amount: Number(body.amount) || 0,
  merchant: body.merchant || 'Unknown',
  location: body.location || 'Unknown',
  transaction_time: body.transaction_time || new Date(),
  encrypted_value: encrypt(body.amount || 0),
  fraud_status: body.status || body.fraud_status || 'PENDING',
});

const addTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const baseData = buildTransactionPayload(req.body, req.user.id);
    const recentTransactions = await getRecentTransactionsByUser(req.user.id);
    const fraudResult = detectFraud({ ...baseData, created_at: baseData.transaction_time }, recentTransactions);
    const transactionData = {
      ...baseData,
      fraud_status: fraudResult.riskLevel,
      fraud_score: fraudResult.score,
    };

    const transaction = await createTransaction(transactionData);
    res.status(201).json({ transaction });
  } catch (error) {
    console.error('addTransaction error:', error);
    next(error);
  }
};

const editTransaction = async (req, res, next) => {
  try {
    const transaction = await getTransactionById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const updatedData = buildTransactionPayload(req.body, req.user.id);
    const recentTransactions = await getRecentTransactionsByUser(req.user.id);
    const fraudResult = detectFraud({ ...updatedData, created_at: transaction.transaction_time }, recentTransactions);
    updatedData.fraud_status = fraudResult.riskLevel;
    updatedData.fraud_score = fraudResult.score;

    const updatedTransaction = await updateTransaction(req.params.id, updatedData);
    res.json({ transaction: updatedTransaction });
  } catch (error) {
    console.error('editTransaction error:', error);
    next(error);
  }
};

const removeTransaction = async (req, res, next) => {
  try {
    const transaction = await getTransactionById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    await deleteTransaction(req.params.id);
    res.json({ message: 'Transaction removed successfully' });
  } catch (error) {
    console.error('removeTransaction error:', error);
    next(error);
  }
};

const uploadTransactions = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'CSV file is required' });
    }

    const results = [];
    const csvFilePath = path.join(__dirname, '../uploads', req.file.filename);
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          const createdRecords = [];
          for (const row of results) {
            const amount = Number(row.amount) || 0;
            const baseData = {
              bank_id: Number(row.bank_id) || 1,
              user_id: req.user.id,
              account_number: row.account_number || `ACCT-${Date.now()}`,
              amount,
              merchant: row.merchant || 'Unknown',
              location: row.location || 'Unknown',
              transaction_time: row.transaction_time ? new Date(row.transaction_time) : new Date(),
              encrypted_value: encrypt(amount),
              fraud_status: row.status || row.fraud_status || 'PENDING',
            };
            const recentTransactions = await getRecentTransactionsByUser(req.user.id);
            const fraudResult = detectFraud({ ...baseData, created_at: baseData.transaction_time }, recentTransactions);
            const transactionData = {
              ...baseData,
              fraud_status: fraudResult.riskLevel,
              fraud_score: fraudResult.score,
            };
            const record = await createTransaction(transactionData);
            createdRecords.push(record);
          }
          res.status(201).json({ uploaded: createdRecords.length, transactions: createdRecords });
        } catch (error) {
          console.error('uploadTransactions inner error:', error);
          next(error);
        }
      })
      .on('error', (error) => {
        console.error('uploadTransactions file error:', error);
        res.status(500).json({ message: 'CSV processing failed', error: error.message });
      });
  } catch (error) {
    console.error('uploadTransactions error:', error);
    next(error);
  }
};

module.exports = {
  fetchTransactions,
  fetchTransaction,
  addTransaction,
  editTransaction,
  removeTransaction,
  uploadTransactions,
};
