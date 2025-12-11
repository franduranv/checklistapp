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
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  items: [{
    areaName: String,
    itemText: String,
    value: mongoose.Schema.Types.Mixed, // Can be boolean, string, etc.
    comment: String
  }],
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