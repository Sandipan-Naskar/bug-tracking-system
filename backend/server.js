
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bugtracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'developer', 'tester', 'manager'], default: 'developer' },
  avatar: String,
}, { timestamps: true });

// Bug Schema
const bugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [String],
  stepsToReproduce: String,
  expectedBehavior: String,
  actualBehavior: String,
  environment: String,
  attachments: [String],
  dueDate: Date,
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Bug = mongoose.model('Bug', bugSchema);

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret');
    res.status(201).json({ token, user: { id: user._id, name, email, role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret');
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Bug CRUD routes
app.get('/api/bugs', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, severity, assignedTo } = req.query;
    const filter = {};
    
    if (status && status !== 'all') filter.status = status;
    if (severity && severity !== 'all') filter.severity = severity;
    if (assignedTo && assignedTo !== 'all') filter.assignedTo = assignedTo;

    const bugs = await Bug.find(filter)
      .populate('assignedTo', 'name email')
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Bug.countDocuments(filter);
    res.json({ bugs, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/bugs', async (req, res) => {
  try {
    const bug = new Bug(req.body);
    await bug.save();
    await bug.populate('assignedTo reportedBy', 'name email');
    
    // Send notification email if assigned
    if (bug.assignedTo) {
      const assignedUser = await User.findById(bug.assignedTo);
      if (assignedUser) {
        await sendNotificationEmail(assignedUser.email, bug);
      }
    }
    
    res.status(201).json(bug);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/bugs/:id', async (req, res) => {
  try {
    const bug = await Bug.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignedTo reportedBy', 'name email');
    res.json(bug);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/bugs/:id', async (req, res) => {
  try {
    await Bug.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bug deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Notification functions
const sendNotificationEmail = async (email, bug) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `New Bug Assigned: ${bug.title}`,
      html: `
        <h2>You have been assigned a new bug</h2>
        <p><strong>Title:</strong> ${bug.title}</p>
        <p><strong>Description:</strong> ${bug.description}</p>
        <p><strong>Severity:</strong> ${bug.severity}</p>
        <p><strong>Priority:</strong> ${bug.priority}</p>
      `,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

// Cron job for due date notifications
cron.schedule('0 9 * * *', async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueBugs = await Bug.find({
      dueDate: { $lte: tomorrow },
      status: { $in: ['open', 'in-progress'] }
    }).populate('assignedTo', 'name email');

    for (const bug of dueBugs) {
      if (bug.assignedTo) {
        await sendNotificationEmail(bug.assignedTo.email, bug);
      }
    }
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
