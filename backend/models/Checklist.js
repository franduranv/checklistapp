const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  items: {
    bathroom: {
      type: Boolean,
      default: false
    },
    kitchen: {
      type: Boolean,
      default: false
    },
    whites: {
      type: Boolean,
      default: false
    },
    livingRoom: {
      type: Boolean,
      default: false
    }
  },
  photos: [{
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['before', 'after', 'detail'],
      required: true
    },
    description: String
  }],
  finalStatus: {
    type: String,
    enum: ['clean-ready', 'with-observations', 'not-ready'],
    required: true
  },
  comments: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Checklist', checklistSchema); 