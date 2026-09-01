const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const crypto = require('crypto');
const os = require('os');

const User = require('../models/User');
const Community = require('../models/Community');
const Message = require('../models/Message');

let pty;
try {
  pty = require('node-pty');
} catch (e) {
  console.warn("node-pty module not found or failed to load. Will fallback to child_process.spawn.");
}

const isWindows = os.platform() === 'win32';
const tempDir = path.join(__dirname, '../temp');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Track connected users for real-time presence (userId -> { user, socketIds: Set })
const onlineUsers = new Map();

module.exports = (io) => {
  // Socket.IO Authentication Middleware (Optional - allows guests to view public chat)
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || 
                    (socket.handshake.headers.authorization && socket.handshake.headers.authorization.split(' ')[1]);

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        if (decoded && decoded.id) {
          const user = await User.findById(decoded.id).select('fullName username avatar role xp');
          if (user) {
            socket.user = user;
          }
        }
      }
    } catch (err) {
      // Invalid/expired token: socket connects as guest (socket.user = null)
      socket.user = null;
    }
    next();
  });

  io.on('connection', (socket) => {
    const user = socket.user;
    const userId = user ? user._id.toString() : null;

    // 1. Online Presence Tracking
    if (userId) {
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, {
          user: {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            avatar: user.avatar,
            role: user.role
          },
          socketIds: new Set([socket.id])
        });
      } else {
        onlineUsers.get(userId).socketIds.add(socket.id);
      }
    }

    // Broadcast current online count to all connected sockets
    const broadcastOnlinePresence = () => {
      const usersList = Array.from(onlineUsers.values()).map(v => v.user);
      io.emit('online_presence', {
        count: Math.max(1, onlineUsers.size),
        users: usersList
      });
    };

    broadcastOnlinePresence();

    // 2. Chat Room Management
    socket.on('join_room', async ({ room }) => {
      if (!room || room.includes('undefined') || room.includes('null')) return;

      // If room is a private community room (e.g. "community:650..." or "community:slug"), check membership
      if (room.startsWith('community:')) {
        const communityIdentifier = room.replace('community:', '');
        if (!communityIdentifier) return;

        const isObjectId = mongoose.Types.ObjectId.isValid(communityIdentifier);
        const queryComm = isObjectId ? { $or: [{ _id: communityIdentifier }, { slug: communityIdentifier }] } : { slug: communityIdentifier };

        try {
          const comm = await Community.findOne(queryComm);
          if (!comm) {
            socket.emit('chat_error', { message: 'Community not found' });
            return;
          }

          if (comm.isPrivate) {
            if (!user) {
              socket.emit('chat_error', { message: 'Authentication required for private community' });
              return;
            }
            const myId = user._id.toString();
            const isMember = comm.members && comm.members.some(m => (m._id ? m._id.toString() : m.toString()) === myId);
            const isCreator = comm.creator && (comm.creator._id ? comm.creator._id.toString() : comm.creator.toString()) === myId;
            const isAdmin = user.role === 'admin';

            if (!isMember && !isCreator && !isAdmin) {
              socket.emit('chat_error', { message: 'Access denied: You are not a member of this private community' });
              return;
            }
          }

          // Join both ID and slug based rooms for seamless dual-lookup
          socket.join(`community:${comm._id.toString()}`);
          if (comm.slug) {
            socket.join(`community:${comm.slug}`);
          }
          socket.emit('room_joined', { room: `community:${comm._id.toString()}` });
          return;
        } catch (e) {
          console.error('Error verifying community room:', e);
          socket.emit('chat_error', { message: 'Error joining community room' });
          return;
        }
      }

      socket.join(room);
      socket.emit('room_joined', { room });
    });

    socket.on('leave_room', ({ room }) => {
      if (room && !room.includes('undefined')) {
        socket.leave(room);
      }
    });

    // 3. Real-time Message Sending & MongoDB Persistence
    socket.on('send_message', async ({ roomType = 'global', channel = 'general', communityId = null, content, codeSnippet }) => {
      if (!user) {
        socket.emit('chat_error', { message: 'You must be logged in to send messages.' });
        return;
      }

      if (!content || !content.trim()) {
        socket.emit('chat_error', { message: 'Message content cannot be empty.' });
        return;
      }

      try {
        let commDoc = null;
        if (roomType === 'community' && communityId) {
          const isObjectId = mongoose.Types.ObjectId.isValid(communityId);
          const queryComm = isObjectId ? { $or: [{ _id: communityId }, { slug: communityId }] } : { slug: communityId };
          commDoc = await Community.findOne(queryComm);

          if (!commDoc) {
            socket.emit('chat_error', { message: 'Community not found.' });
            return;
          }

          if (commDoc.isPrivate) {
            const myId = user._id.toString();
            const isMember = commDoc.members && commDoc.members.some(m => (m._id ? m._id.toString() : m.toString()) === myId);
            const isCreator = commDoc.creator && (commDoc.creator._id ? commDoc.creator._id.toString() : commDoc.creator.toString()) === myId;
            const isAdmin = user.role === 'admin';

            if (!isMember && !isCreator && !isAdmin) {
              socket.emit('chat_error', { message: 'Access restricted to members.' });
              return;
            }
          }
        }

        // Save to MongoDB Atlas
        const messageDoc = await Message.create({
          sender: user._id,
          content: content.trim(),
          roomType,
          channel: roomType === 'global' ? channel : '',
          community: commDoc ? commDoc._id : null,
          codeSnippet: codeSnippet || { language: '', code: '' }
        });

        const populated = await Message.findById(messageDoc._id)
          .populate('sender', 'fullName username avatar role xp');

        // Broadcast to relevant rooms
        if (roomType === 'global') {
          const room = `global:${channel}`;
          io.to(room).emit('new_message', {
            room,
            message: populated
          });
        } else if (commDoc) {
          const idRoom = `community:${commDoc._id.toString()}`;
          const slugRoom = `community:${commDoc.slug}`;

          io.to(idRoom).emit('new_message', {
            room: idRoom,
            message: populated
          });

          if (commDoc.slug && slugRoom !== idRoom) {
            io.to(slugRoom).emit('new_message', {
              room: slugRoom,
              message: populated
            });
          }
        }

      } catch (err) {
        console.error('Error saving real-time chat message:', err);
        socket.emit('chat_error', { message: 'Failed to send message.' });
      }
    });

    // 4. Code Execution Terminal (Playground)
    let ptyProcess = null;
    let filePaths = [];

    socket.on('run_code', ({ language, code }) => {
      if (ptyProcess) {
        ptyProcess.kill();
        ptyProcess = null;
      }

      const fileId = crypto.randomBytes(8).toString('hex');
      let shell = '';
      let args = [];

      try {
        if (language === 'javascript') {
          const jsPath = path.join(tempDir, `main_${fileId}.js`);
          fs.writeFileSync(jsPath, code);
          filePaths.push(jsPath);
          shell = isWindows ? 'node.exe' : 'node';
          args = [jsPath];
        } else if (language === 'python') {
          const pyPath = path.join(tempDir, `main_${fileId}.py`);
          fs.writeFileSync(pyPath, code);
          filePaths.push(pyPath);
          shell = isWindows ? 'python.exe' : 'python3';
          args = [pyPath];
        } else if (language === 'c++' || language === 'cpp') {
          const cppPath = path.join(tempDir, `main_${fileId}.cpp`);
          const outPath = isWindows ? path.join(tempDir, `main_${fileId}.exe`) : path.join(tempDir, `main_${fileId}.out`);
          fs.writeFileSync(cppPath, code);
          filePaths.push(cppPath);
          filePaths.push(outPath);
          
          socket.emit('terminal_data', '\x1b[33mCompiling...\x1b[0m\r\n');
          
          const { exec } = require('child_process');
          exec(`g++ "${cppPath}" -o "${outPath}"`, (error, stdout, stderr) => {
            if (error) {
              socket.emit('terminal_data', '\x1b[31mCompilation Error:\x1b[0m\r\n' + stderr.replace(/\n/g, '\r\n'));
              socket.emit('process_exit', 1);
              return;
            }
            socket.emit('terminal_data', '\x1b[32mCompilation successful! Running...\x1b[0m\r\n');
            spawnPty(outPath, []);
          });
          return;
        } else {
          socket.emit('terminal_data', '\x1b[31mLanguage not supported for interactive execution.\x1b[0m\r\n');
          socket.emit('process_exit', 1);
          return;
        }

        spawnPty(shell, args);

        function spawnPty(executable, spawnArgs) {
          try {
            if (!pty) throw new Error("node-pty not available");
            ptyProcess = pty.spawn(executable, spawnArgs, {
              name: 'xterm-color',
              cols: 80,
              rows: 24,
              cwd: tempDir,
              env: process.env
            });

            ptyProcess.onData((data) => {
              socket.emit('terminal_data', data);
            });

            ptyProcess.onExit(({ exitCode, signal }) => {
              ptyProcess = null;
              socket.emit('terminal_data', `\r\n\x1b[90m[Process exited with code ${exitCode}]\x1b[0m\r\n`);
              socket.emit('process_exit', exitCode);
              
              filePaths.forEach(p => {
                if (fs.existsSync(p)) {
                  try { fs.unlinkSync(p); } catch (e) {}
                }
              });
              filePaths = [];
            });
          } catch (ptyErr) {
            const { spawn } = require('child_process');
            if (executable === 'python' || executable === 'python3' || executable === 'python.exe') {
                spawnArgs.unshift('-u');
            }

            ptyProcess = spawn(executable, spawnArgs, {
              cwd: tempDir,
              env: process.env
            });
            
            ptyProcess.write = (data) => {
                if (ptyProcess.stdin) ptyProcess.stdin.write(data);
                socket.emit('terminal_data', data); 
            };

            ptyProcess.stdout.on('data', (data) => {
              socket.emit('terminal_data', data.toString());
            });

            ptyProcess.stderr.on('data', (data) => {
              socket.emit('terminal_data', data.toString());
            });

            ptyProcess.on('close', (exitCode) => {
              ptyProcess = null;
              socket.emit('terminal_data', `\r\n\x1b[90m[Process exited with code ${exitCode}]\x1b[0m\r\n`);
              socket.emit('process_exit', exitCode);
              
              filePaths.forEach(p => {
                if (fs.existsSync(p)) {
                  try { fs.unlinkSync(p); } catch (e) {}
                }
              });
              filePaths = [];
            });
          }
        }

      } catch (err) {
        socket.emit('terminal_data', '\x1b[31mExecution Error:\x1b[0m\r\n' + err.message + '\r\n');
        socket.emit('process_exit', 1);
      }
    });

    socket.on('terminal_input', (data) => {
      if (ptyProcess) {
        ptyProcess.write(data);
      }
    });

    socket.on('kill_process', () => {
      if (ptyProcess) {
        ptyProcess.kill();
        socket.emit('terminal_data', '\r\n\x1b[31m[Process killed by user]\x1b[0m\r\n');
        ptyProcess = null;
      }
    });

    // 5. Disconnection & Cleanup
    socket.on('disconnect', () => {
      if (userId && onlineUsers.has(userId)) {
        const userEntry = onlineUsers.get(userId);
        userEntry.socketIds.delete(socket.id);
        if (userEntry.socketIds.size === 0) {
          onlineUsers.delete(userId);
        }
        broadcastOnlinePresence();
      }

      if (ptyProcess) {
        ptyProcess.kill();
      }
      filePaths.forEach(p => {
        if (fs.existsSync(p)) {
          try { fs.unlinkSync(p); } catch (e) {}
        }
      });
    });
  });
};
