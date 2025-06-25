// backend/models/healthRecordModel.js

const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true },
  recordType: { type: String, required: true },
  details: { type: String }
}, 
{ timestamps: true }  // Adds createdAt and updatedAt fields
);

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);
module.exports = HealthRecord;
