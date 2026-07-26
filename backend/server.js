const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const sortingRoutes = require('./routes/sortingRoutes');
const searchingRoutes = require('./routes/searchingRoutes');
const dsRoutes = require('./routes/dsRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'AlgoVerse API is running' });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/sorting', sortingRoutes);
app.use('/api/v1/searching', searchingRoutes);
app.use('/api/v1/ds', dsRoutes);

// Database Connection & Server Listener
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

if (MONGODB_URI && MONGODB_URI !== 'your_mongodb_atlas_connection_string') {
    mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
        .then(() => {
            console.log('Connected to MongoDB');
            startServer();
        })
        .catch((error) => {
            console.error('MongoDB connection error:', error.message);
            console.log('Starting server in fallback mode without active DB...');
            startServer();
        });
} else {
    console.log('MongoDB URI not configured. Server starting without database connection for development.');
    startServer();
}
