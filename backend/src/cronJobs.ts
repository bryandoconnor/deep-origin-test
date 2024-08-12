// src/server.ts (or a new file like src/cronJobs.ts)

import cron from 'node-cron';

cron.schedule('* * * * *', () => {
    console.log('Cron job triggered at', new Date());
});
