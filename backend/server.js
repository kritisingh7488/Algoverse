const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const sortingRoutes = require('./routes/sortingRoutes');
const searchingRoutes = require('./routes/searchingRoutes');
const dsRoutes = require('./routes/dsRoutes');
const treeRoutes = require('./routes/treeRoutes');
const graphRoutes = require('./routes/graphRoutes');
const stringRoutes = require('./routes/stringRoutes');
const backtrackingRoutes = require('./routes/backtrackingRoutes');
const dpRoutes = require('./routes/dpRoutes');
const userRoutes = require('./routes/userRoutes');
const executeRoutes = require('./routes/executeRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Import socket controller
require('./controllers/socketController')(io);

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

// Health Check Route
app.get('/api/v1/health', (req, res) => {
    const dbConnected = mongoose.connection.readyState === 1;
    res.json({ 
        status: 'OK',
        database: dbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/sorting', sortingRoutes);
app.use('/api/v1/searching', searchingRoutes);
app.use('/api/v1/ds', dsRoutes);
app.use('/api/v1/tree', treeRoutes);
app.use('/api/v1/graph', graphRoutes);
app.use('/api/v1/string', stringRoutes);
app.use('/api/v1/backtracking', backtrackingRoutes);
app.use('/api/v1/dp', dpRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/execute', executeRoutes);


// Database Connection & Server Listener
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const startServer = () => {
    server.listen(PORT, () => {
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
