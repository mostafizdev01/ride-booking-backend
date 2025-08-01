import mongoose from "mongoose";
import app from "./app";
import { Server } from "http";
import dotenv from "dotenv";
import seedSuparAdmin from "./app/utilis/seedSuparAdmin";
dotenv.config();

const port = process.env.PORT || 3000;

let server: Server;

const MONGODB_URI = process.env.MONGODB_URI as string;

async function main() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to Database");

        server = app.listen(port, () => {
            console.log(`Server is running on ${port}`);
        });
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

(async () => {
    await main();
    await seedSuparAdmin()
})()

process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});


process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    if (server) {
        server.close(async () => {
            console.log("Server closed.");
            try {
                await mongoose.connection.close();
                console.log("Database connection closed.");
            } catch (err) {
                console.error("Error closing database connection:", err);
            }
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

process.on("SIGINT", () => {
    console.log("SIGINT received. Shutting down gracefully...");
    if (server) {
        server.close(async () => {
            console.log("Server closed.");
            try {
                await mongoose.connection.close();
                console.log("Database connection closed.");
            } catch (err) {
                console.error("Error closing database connection:", err);
            }
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});