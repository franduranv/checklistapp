const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  pin: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 6
  },
  role: {
    type: String,
    default: 'operator',
    enum: ['operator', 'admin']
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Método para verificar PIN
userSchema.methods.verifyPin = function(pin) {
  return this.pin === pin;
};

module.exports = mongoose.model('User', userSchema); 