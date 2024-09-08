// backend/models/userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Optional: trims whitespace from email
    lowercase: true // Optional: converts email to lowercase
  },
  password: {
    type: String,
    required: true,
  }
});

// Pre-save middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// Method to validate a password
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
