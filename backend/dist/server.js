"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitNotification = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const node_cron_1 = __importDefault(require("node-cron"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const tasks = []; // Use the Task type
// io.on('connection', (socket) => {
//     console.log('socket connected');
// });
const emitNotification = (message) => {
    io.emit('notify', message);
};
exports.emitNotification = emitNotification;
// Example cron job
node_cron_1.default.schedule('* * * * *', () => {
    const message = 'This is a recurring notification!';
    io.emit('notify', message);
});
server.listen(3001, () => {
    console.log('Server running on port 3001');
});
