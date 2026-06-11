import {Server} from "socket.io"

let io:Server;
const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.CLIENT_URL || "http://localhost:3000"
      ],
    },
  });

  console.log("Socket.IO initialized");

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};
const getIO=()=>{
    if(!io){
        throw new Error("Socket.io not initialized")
    }
    return io;
}

export {
    initSocket,
    getIO
}