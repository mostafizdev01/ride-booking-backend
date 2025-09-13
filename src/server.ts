import http from "http"
import app from "./app";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import { Server } from "socket.io";


const server = http.createServer(app)

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173"
  }
});

const startServer = async () => {
  try {

    io.on("connection", (socket)=> {
      console.log("✅ Driver connnected", socket.id)

      socket.on("disconnect", ()=> {
        console.log("❌ Driver Disconnected", socket.id)
      })
    })    

    await mongoose.connect(envVars.DB_URL)
    console.log("✅ DB Connected Successfull")

    server.listen(envVars.PORT, () => {
      console.log(`✅ Ride booking server is running on port ${envVars.PORT}`);
    })
  } catch (error) {
    console.log(error)
  }
}


(async ()=> { // create IIFE function & start server
  await startServer()
})()