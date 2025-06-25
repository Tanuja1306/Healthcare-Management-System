// backend/routes/healthRecordRoutes.js

const express = require('express');
const router = express.Router();
const HealthRecord = require('../models/healthRecordModel');

// CREATE - POST /api/health-records
router.post('/', async (req, res) => {
    const { userId, date, recordType, details } = req.body;

    if (!userId || !date || !recordType) {
        return res.status(400).json({ message: 'userId, date, and recordType are required' });
    }

    try {
        const healthRecord = new HealthRecord({ userId, date, recordType, details });
        await healthRecord.save();
        res.status(201).json(healthRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// READ - GET /api/health-records/user/:userId
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const healthRecords = await HealthRecord.find({ userId }).populate('userId', 'email');
        res.status(200).json(healthRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE - PUT /api/health-records/:id
router.put('/:id', async (req, res) => {
    try {
        const healthRecord = await HealthRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!healthRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(200).json(healthRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE - DELETE /api/health-records/:id
router.delete('/:id', async (req, res) => {
    try {
        const healthRecord = await HealthRecord.findByIdAndDelete(req.params.id);
        if (!healthRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
