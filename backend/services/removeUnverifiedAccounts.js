import {User} from '../models/userModel.js';
import cron from 'node-cron';
export const removeUnverifiedAccounts = async () => {
    cron.schedule('*/5 * * * *', async () => {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        await User.deleteMany({
            accountVerified: false,
            createdAt: { $lt: thirtyMinutesAgo },
        });
    });
}