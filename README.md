# Tic_Tac_Toe_Socket.io

## Overview
This project is a simple Node.js application using Socket.IO to manage real-time, bidirectional communication between web clients and servers. The application allows up to two users to connect simultaneously and exchange messages. If a third user attempts to connect, they will be notified that the room is full and will be disconnected.

## Features
- **Connection Management**: Limits the number of connected users to two.
- **Real-time Messaging**: Allows connected users to send and receive messages in real-time.
- **User Notifications**: Notifies users when the room is full and handles user disconnections gracefully.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Karanjoshi128/Tic_Tac_Toe_Socket.io.git
   ```
2. Navigate to the project directory:
   ```sh
   cd client
   cd server
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```

## Usage
1. Start the server:
   ```sh
   node index.js
   ```
2. Open your web browser and navigate to `http://localhost:3000`.

## Code Explanation
### Connection Handling
The server listens for incoming connections and manages the number of connected users:
```javascript
let connectedUsers = 0;

io.on('connection', (socket) => {
  if (connectedUsers >= 2) {
    socket.emit('room-full'); // Notify the client that the room is full
    socket.disconnect(); // Disconnect the socket
    return;
  }

  connectedUsers++;
  console.log(`User connected. Total connected users: ${connectedUsers}`);

  // Handle user disconnection
  socket.on('disconnect', () => {
    connectedUsers--;
    console.log(`User disconnected. Total connected users: ${connectedUsers}`);
  });

  // Handle other events, e.g., message handling
  socket.on('send-message', (data) => {
    socket.broadcast.emit('receive-message', data);
  });
});
```

### Server Initialization
The server listens on port 3000:
```javascript
server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
```

## Events
- **connection**: Triggered when a new user connects. If the room is full, the user is notified and disconnected.
- **disconnect**: Triggered when a user disconnects, decrementing the count of connected users.
- **send-message**: Triggered when a user sends a message. The message is broadcast to all other connected users.

## Dependencies
- [Node.js](https://nodejs.org/)
- [Socket.IO](https://socket.io/)

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Contact
For any questions or inquiries, please contact joshikaran.aad.0007@gmail.com.

---
