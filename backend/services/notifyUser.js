import cron from 'node-cron';
import {Book} from '../models/bookModel.js';
import {User} from '../models/userModel.js';
import { sendEmail } from '../utils/sendEmail.js';
import { Borrow } from '../models/borrowModel.js';
export const notifyUser=()=> {
    cron.schedule('*/30 * * * *', async () => {
        try {
            const oneDayAgo=new Date(Date.now()- 24*60*60*1000);
            const borrowers=await Borrow.find(
                {
                    dueDate:{
                        $lt:oneDayAgo,
                    },
                    returnDate:null,
                    notified:false,
                }
            );
            for(const element of borrowers){
                if(element.user&&element.user.email){
                    sendEmail({
                        email:element.user.email,
                        subject:"Book Reminder Successful",
                        message:`Hello ${element.user.name},\n\n This is a reminder that the book "${element.book.title}" is overdue. Please return it as soon as possible.\n\n Thank you!`,
                    })
                    element.notified=true;
                    await element.save();
                }
            }

        } catch (error) {
            console.error("Error in notifyUser:", error);
        }
    });
}