const { getAllBanks, getBankById, createBank, updateBank, deleteBank } = require('../models/bankModel');

const fetchBanks = async (req, res, next) => {
  try {
    const banks = await getAllBanks();
    res.json({ banks });
  } catch (error) {
    console.error('fetchBanks error:', error);
    next(error);
  }
};

const fetchBank = async (req, res, next) => {
  try {
    const bank = await getBankById(req.params.id);
    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' });
    }
    res.json({ bank });
  } catch (error) {
    console.error('fetchBank error:', error);
    next(error);
  }
};

const addBank = async (req, res, next) => {
  try {
    const bank = await createBank(req.body);
    res.status(201).json({ bank });
  } catch (error) {
    console.error('addBank error:', error);
    next(error);
  }
};

const editBank = async (req, res, next) => {
  try {
    const bank = await getBankById(req.params.id);
    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' });
    }
    const updated = await updateBank(req.params.id, req.body);
    res.json({ bank: updated });
  } catch (error) {
    console.error('editBank error:', error);
    next(error);
  }
};

const removeBank = async (req, res, next) => {
  try {
    const bank = await getBankById(req.params.id);
    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' });
    }
    await deleteBank(req.params.id);
    res.json({ message: 'Bank deleted successfully' });
  } catch (error) {
    console.error('removeBank error:', error);
    next(error);
  }
};

module.exports = { fetchBanks, fetchBank, addBank, editBank, removeBank };
