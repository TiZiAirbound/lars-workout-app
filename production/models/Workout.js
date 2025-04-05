const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  },
  exercises: [{
    name: String,
    completed: Boolean,
    time: Number,
    sets: Number,
    reps: Number,
    description: String
  }]
});

module.exports = mongoose.model('Workout', workoutSchema); 