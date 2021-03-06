if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: `${__dirname}/.env` });
} else {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const flowersRoutes = require('./routes/flowersRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Mongoose connection
mongoose.connect(process.env.MLAB_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middlewares
app.use(cors());
app.use(express.json());
const buildFolder = path.join(__dirname, '..', '/frontend', '/build');
app.use(express.static(buildFolder));
console.log(buildFolder)

// Routers
app.use('/api/flowers', flowersRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(buildFolder, 'index.html'));
});

// Error handling
function errorHandler(error, request, response, next) {
  return response.status(error.status || 500).json({
    error: {
      message: error.message || 'Something broke!',
    },
  });
}
app.use(errorHandler);

// Server listening
app.listen(PORT,
  () => console.log(`Listening on port ${PORT}`)
);
