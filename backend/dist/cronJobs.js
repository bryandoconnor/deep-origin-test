"use strict";
// src/server.ts (or a new file like src/cronJobs.ts)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
node_cron_1.default.schedule('* * * * *', () => {
    console.log('Cron job triggered at', new Date());
});
