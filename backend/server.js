const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const connectDB = require('./database');
const User = require('./User'); 
const AdminActivityLog = require('./models/AdminActivityLog'); 
const verifyAdmin = require('./admin'); 
require('dotenv').config(); 


const app = express();


connectDB();


app.use(cors());
app.use(bodyParser.json());


const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Helper function to send email verification link
const sendVerificationEmail = (email, token) => {
  const verificationLink = `http://localhost:3000/verify-email?token=${token}`; 
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking on the following link: ${verificationLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending verification email:", error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};


const sendLoginEmail = (email, subject, text) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending login email:", error);
    } else {
      console.log('Login email sent:', info.response);
    }
  });
};

// Register endpoint
app.post('/register', async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ full_name, email, password: hashedPassword });
    await newUser.save();

    const activityLog = new AdminActivityLog({ activity: `New user registered: ${email}` });
    await activityLog.save();

    const verificationToken = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Email verification endpoint
app.get('/api/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: 'Invalid token or user not found' });
    }

    user.isVerified = true;
    await user.save();

    const activityLog = new AdminActivityLog({ activity: `User verified email: ${user.email}` });
    await activityLog.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for admin login
    const adminCheck = verifyAdmin(email, password);
    if (adminCheck.isValid) {
      const activityLog = new AdminActivityLog({ activity: 'Admin logged in' });
      await activityLog.save();

      console.log('Sending login email to admin...');
      sendLoginEmail(email, 'Admin Login Notification', 'You have successfully logged in as an admin.');

      return res.status(200).json({ message: 'Admin login successful', token: adminCheck.token });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token for regular users
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Log activity
    const activityLog = new AdminActivityLog({ activity: `User logged in: ${email}` });
    await activityLog.save();

    console.log('Sending login email to user...');
    sendLoginEmail(email, 'User Login Notification', 'You have successfully logged in.');

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user list and activity log for admin
app.get('/admin/activity-log', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find();
    const activityLogs = await AdminActivityLog.find();

    res.status(200).json({ users, activityLogs });
  } catch (error) {
    console.error("Error fetching activity log:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
