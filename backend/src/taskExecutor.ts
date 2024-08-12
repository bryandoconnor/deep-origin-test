import cron from 'node-cron';
import { emitNotification } from './server';

export function scheduleTask(cronTime: string, taskId: string) {
    cron.schedule(cronTime, () => {
        console.log(`Executing task ${taskId} at ${new Date().toISOString()}`);
        emitNotification(taskId);
    });
}
