// Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: { type: Date }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;