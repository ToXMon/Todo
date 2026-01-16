import cron from 'node-cron';
import dotenv from 'dotenv';
dotenv.config();

import { todoService } from '../services/todoService.js';
import { emailService } from '../services/emailService.js';

// Check for upcoming deadlines and send notifications
async function checkDeadlines() {
  console.log('🔔 Checking for upcoming deadlines...');
  
  try {
    // Get todos due in the next 24 hours
    const dueSoonTodos = await todoService.getDueSoon(24);
    console.log(`Found ${dueSoonTodos.length} todos due soon`);

    for (const todo of dueSoonTodos) {
      if (todo.email) {
        const sent = await emailService.sendDeadlineReminder(todo);
        if (sent) {
          await todoService.markNotified(todo.id, 'upcoming');
        }
      }
    }

    // Get overdue todos
    const overdueTodos = await todoService.getOverdue();
    console.log(`Found ${overdueTodos.length} overdue todos`);

    for (const todo of overdueTodos) {
      if (todo.email) {
        const sent = await emailService.sendOverdueNotification(todo);
        if (sent) {
          await todoService.markNotified(todo.id, 'overdue');
        }
      }
    }

    console.log('✅ Deadline check completed');
  } catch (error) {
    console.error('❌ Error checking deadlines:', error);
  }
}

// Schedule to run every hour
cron.schedule('0 * * * *', () => {
  checkDeadlines();
});

// Also run immediately when script starts
checkDeadlines();

console.log('📅 Notification job started - checking every hour');
