const express = require('express');
const router = express.Router();
const { calculatePaint } = require('../controllers/paintCalculator');

router.post('/calculate-paint', calculatePaint);

module.exports = router;
