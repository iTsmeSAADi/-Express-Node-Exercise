const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/User.Routes');
const sequelize = require('./config/database.js');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

app.use(cors())

// Routes
app.use('/api', userRoutes);

// Handle incorrect routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route does not exist' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
