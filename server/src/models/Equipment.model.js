const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, 
  dailyPrice: { type: Number, required: true },
  image: { type: String, required: true }, 
  available: { type: Boolean, default: true },

  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);