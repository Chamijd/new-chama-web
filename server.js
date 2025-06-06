const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/User');
const Comment = require('./models/Comment');

const app = express();
mongoose.connect('mongodb+srv://yifov84170:5HPjp58UeDrdMMHi@cluster0.sedhk0k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json("Registered successfully!");
  } catch (err) {
    res.json("Error: " + err.message);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.json({ success: true, user: user.username });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

app.post('/comments', async (req, res) => {
  const comment = new Comment({ username: req.body.username, comment: req.body.comment });
  await comment.save();
  res.sendStatus(200);
});

app.get('/comments', async (req, res) => {
  const comments = await Comment.find().sort({ date: -1 });
  res.json(comments);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
