
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Define User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

// Create User Model
const User = mongoose.model('User', userSchema);

// Serve the registration form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Handle form submission
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email, password });

    newUser.save()
        .then(() => {
            res.send('User registered successfully!');
        })
        .catch(err => {
            res.status(400).send('Error registering user: ' + err.message);
        });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
