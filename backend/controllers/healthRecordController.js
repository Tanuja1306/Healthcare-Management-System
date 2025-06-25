// backend/controllers/healthRecordController.js

const HealthRecord = require('../models/healthRecordModel');

// Create a new health record
exports.createHealthRecord = async (req, res) => {
  const { userId, date, recordType, details } = req.body;

  if (!userId || !date || !recordType) {
    return res.status(400).json({ message: 'userId, date, and recordType are required' });
  }

  try {
    const newHealthRecord = new HealthRecord({
      userId,  // Updated to match the schema
      date,
      recordType,
      details
    });

    const savedRecord = await newHealthRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all health records for a user
exports.getHealthRecordsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const healthRecords = await HealthRecord.find({ userId }).populate('userId', 'email');
    res.json(healthRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a health record
exports.updateHealthRecord = async (req, res) => {
  const { recordId } = req.params;

  try {
    const updatedRecord = await HealthRecord.findByIdAndUpdate(
      recordId, 
      req.body, 
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a health record
exports.deleteHealthRecord = async (req, res) => {
  const { recordId } = req.params;

  try {
    const deletedRecord = await HealthRecord.findByIdAndDelete(recordId);

    if (!deletedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
