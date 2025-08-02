"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const seedSuparAdmin_1 = __importDefault(require("./app/utilis/seedSuparAdmin"));
dotenv_1.default.config();
const port = process.env.PORT || 3000;
let server;
const MONGODB_URI = process.env.MONGODB_URI;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(MONGODB_URI);
            console.log("Connected to Database");
            server = app_1.default.listen(port, () => {
                console.log(`Server is running on ${port}`);
            });
        }
        catch (error) {
            console.error("Error during initialization:", error);
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield main();
    yield (0, seedSuparAdmin_1.default)();
}))();
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
        server.close(() => __awaiter(void 0, void 0, void 0, function* () {
            console.log("Server closed.");
            try {
                yield mongoose_1.default.connection.close();
                console.log("Database connection closed.");
            }
            catch (err) {
                console.error("Error closing database connection:", err);
            }
            process.exit(0);
        }));
    }
    else {
        process.exit(0);
    }
});
process.on("SIGINT", () => {
    console.log("SIGINT received. Shutting down gracefully...");
    if (server) {
        server.close(() => __awaiter(void 0, void 0, void 0, function* () {
            console.log("Server closed.");
            try {
                yield mongoose_1.default.connection.close();
                console.log("Database connection closed.");
            }
            catch (err) {
                console.error("Error closing database connection:", err);
            }
            process.exit(0);
        }));
    }
    else {
        process.exit(0);
    }
});
