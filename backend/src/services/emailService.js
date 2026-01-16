import nodemailer from 'nodemailer';
import config from '../config/index.js';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const emailService = {
  // Send deadline reminder email
  async sendDeadlineReminder(todo) {
    const dueDate = new Date(todo.due_date);
    const formattedDate = dueDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const mailOptions = {
      from: config.email.from,
      to: todo.email,
      subject: `⏰ Reminder: "${todo.title}" is due soon!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 24px; }
            .title { color: #1a1a1a; font-size: 24px; margin: 0 0 8px 0; }
            .subtitle { color: #666; font-size: 14px; }
            .todo-title { font-size: 20px; font-weight: 600; color: #333; margin: 16px 0; }
            .due-date { background: #fff3cd; color: #856404; padding: 12px 16px; border-radius: 8px; margin: 16px 0; }
            .priority { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .priority-high { background: #fee2e2; color: #991b1b; }
            .priority-medium { background: #fef3c7; color: #92400e; }
            .priority-low { background: #d1fae5; color: #065f46; }
            .description { color: #666; line-height: 1.6; margin: 16px 0; }
            .footer { text-align: center; margin-top: 24px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <h1 class="title">📋 Todo Reminder</h1>
                <p class="subtitle">You have an upcoming deadline</p>
              </div>
              
              <div class="todo-title">${todo.title}</div>
              
              <span class="priority priority-${todo.priority}">${todo.priority.toUpperCase()}</span>
              
              ${todo.description ? `<p class="description">${todo.description}</p>` : ''}
              
              <div class="due-date">
                <strong>📅 Due:</strong> ${formattedDate}
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated reminder from your Todo App</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Reminder sent for: ${todo.title}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send reminder for: ${todo.title}`, error);
      return false;
    }
  },

  // Send overdue notification email
  async sendOverdueNotification(todo) {
    const dueDate = new Date(todo.due_date);
    const formattedDate = dueDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const mailOptions = {
      from: config.email.from,
      to: todo.email,
      subject: `🚨 Overdue: "${todo.title}" was due!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-top: 4px solid #ef4444; }
            .header { text-align: center; margin-bottom: 24px; }
            .title { color: #ef4444; font-size: 24px; margin: 0 0 8px 0; }
            .subtitle { color: #666; font-size: 14px; }
            .todo-title { font-size: 20px; font-weight: 600; color: #333; margin: 16px 0; }
            .due-date { background: #fee2e2; color: #991b1b; padding: 12px 16px; border-radius: 8px; margin: 16px 0; }
            .priority { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .priority-high { background: #fee2e2; color: #991b1b; }
            .priority-medium { background: #fef3c7; color: #92400e; }
            .priority-low { background: #d1fae5; color: #065f46; }
            .description { color: #666; line-height: 1.6; margin: 16px 0; }
            .footer { text-align: center; margin-top: 24px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <h1 class="title">🚨 Overdue Task</h1>
                <p class="subtitle">This task has passed its deadline</p>
              </div>
              
              <div class="todo-title">${todo.title}</div>
              
              <span class="priority priority-${todo.priority}">${todo.priority.toUpperCase()}</span>
              
              ${todo.description ? `<p class="description">${todo.description}</p>` : ''}
              
              <div class="due-date">
                <strong>⚠️ Was due:</strong> ${formattedDate}
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated notification from your Todo App</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Overdue notification sent for: ${todo.title}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send overdue notification for: ${todo.title}`, error);
      return false;
    }
  },
};
