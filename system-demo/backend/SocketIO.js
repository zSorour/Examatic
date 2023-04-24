const { Server } = require("socket.io");

module.exports.initializeServer = (server) => {
  // Start SocketIO Server
  const socketIOServer = new Server(server, {
    path: "/invigilation",
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  socketIOServer.on("connection", (socket) => {
    socket.emit("givenSocketID", socket.id);

    socket.on("outgoingConnection", (data) => {
      const { toInvigilationSocketID, username, fromStudentSocketID, signal } =
        data;
      socketIOServer.to(toInvigilationSocketID).emit("incomingConnection", {
        signal: signal,
        studentSocketID: fromStudentSocketID,
        username: username
      });
    });

    socket.on("acceptIncomingConnection", (data) => {
      console.log("accepted incoming connection!!");
      const { signal, toStudentSocketID } = data;
      console.log(data);
      socketIOServer.to(toStudentSocketID).emit("connectionAccepted", signal);
    });
  });
};
