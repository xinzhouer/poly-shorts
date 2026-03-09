# Feishu Task Bot

A Feishu bot to track tasks within group chats. It automatically extracts task details, assignees, and deadlines, and provides reminders and weekly summaries.

## Features

- **Automatic Task Extraction**: Detects tasks mentioned in chat (e.g., "@Bot Create report by tomorrow").
- **Task Management**: Mark tasks as completed by replying "complete" to the task message.
- **Weekly Summaries**: Automatically sends a summary of completed and pending tasks every Monday at 10 AM.
- **Reminders**: Supports deadline reminders and follow-ups (basic implementation).

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd feishu-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   - Get Feishu credentials from [Feishu Open Platform](https://open.feishu.cn/).
   - Get Supabase credentials from your project dashboard.

4. **Database Setup**
   Run the SQL migration in your Supabase SQL Editor:
   `supabase/migrations/20240523000000_create_feishu_bot_tables.sql`

5. **Run Locally**
   ```bash
   npm run dev
   ```

6. **Expose Local Server**
   Use `ngrok` or similar to expose port 3000 to the internet so Feishu can send events.
   ```bash
   ngrok http 3000
   ```
   Set the Event Subscription URL in Feishu Developer Console to `https://your-ngrok-url/webhook/event`.

## Deployment

You can deploy this bot to Vercel, Railway, or any Node.js hosting provider. Ensure you set the environment variables in your deployment platform.

## Usage

- **Create Task**: Mention the bot in a group chat with task details.
  - Example: `@Bot Prepare meeting slides by Friday @Alice`
- **Complete Task**: Reply to the task message with "complete" or "完成".
- **Check Tasks**: Ask "@Bot my tasks" or "我的任务" to see your pending tasks.
