"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleTask = scheduleTask;
const node_cron_1 = __importDefault(require("node-cron"));
const server_1 = require("./server");
function scheduleTask(cronTime, taskId) {
    node_cron_1.default.schedule(cronTime, () => {
        console.log(`Executing task ${taskId} at ${new Date().toISOString()}`);
        (0, server_1.emitNotification)(taskId);
    });
}
