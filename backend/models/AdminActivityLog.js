// models/AdminActivityLog.js
const mongoose = require('mongoose');

const AdminActivityLogSchema = new mongoose.Schema({
  activity: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const AdminActivityLog = mongoose.model('AdminActivityLog', AdminActivityLogSchema);

module.exports = AdminActivityLog;
