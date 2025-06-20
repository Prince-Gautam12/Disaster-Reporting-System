// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

// ✅ Supabase setup (optional but used earlier)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ✅ Share socket instance globally
app.set('io', io);

// ✅ Routes
const disasterRoutes = require('./routes/disasters');
app.use('/api/disasters', disasterRoutes);

// ✅ Socket events
io.on('connection', (socket) => {
  console.log('🟢 A user connected');
  socket.on('disconnect', () => {
    console.log('🔴 User disconnected');
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
