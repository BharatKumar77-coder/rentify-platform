const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const authRoutes = require('./routes/auth.routes');
const equipmentRoutes = require('./routes/equipment.routes');
const bookingRoutes = require('./routes/booking.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/bookings', bookingRoutes);


// Keep-Alive Route
app.get('/ping', (req, res) => {
  res.status(200).send('Pong! Server is awake.');
});


app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({ message: err.message, stack: process.env.NODE_ENV === 'production' ? null : err.stack });
});

module.exports = app;