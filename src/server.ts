import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";


let server: Server

const startServer = async () => {
  try {
    
    await mongoose.connect(envVars.DB_URL)
    console.log("✅ DB Connected Successfull")

    app.listen(envVars.PORT, () => {
      console.log(`✅ Ride booking server is running on port ${envVars.PORT}`);
    })
  } catch (error) {
    console.log(error)
  }
}


(async ()=> { // create IIFE function & start server
  await startServer()
})()