const express = require('express');
const app = express();
const paintCalculatorRoutes = require('./routes/paintCalculator');

app.use(express.json());
app.use('/api', paintCalculatorRoutes);

module.exports = app;
