# STEP 13 - Reminder Testing Guide

## ✅ What Was Implemented

### Backend
1. **node-cron** - Cron job runs every minute to check for pending reminders
2. **nodemailer** - Email service with console transport (dev) and SendGrid support (production)
3. **Migration** - Added `reminder_sent` boolean column to tasks table
4. **Reminder Service** - `/backend/services/reminderService.js`
   - Checks tasks with `reminder_datetime <= NOW` and `reminder_sent = false`
   - Sends formatted emails (HTML + plain text)
   - Logs detailed output to console in dev mode
   - Marks reminders as sent after successful delivery
5. **Test Email Endpoint** - `/api/email/test-email` (POST, requires auth)
   - Manually test email functionality
   - Sends test reminder with mock task data

### Frontend
1. **TaskModal** - Already had `reminder_datetime` field (datetime-local input)
2. **WorkDesk** - Added "📧 Test Email" button in header
   - Sends test email to verify system works
   - Shows status (⏳ sending, ✅ success, ❌ error)
   - Provides feedback about dev/prod mode

### Environment Variables (.env.example)
```bash
# Email Configuration (Optional - for production)
SENDGRID_API_KEY=         # Leave empty for dev mode
EMAIL_FROM=noreply@diary2.app
```

## 🧪 How to Test

### Test 1: Test Email Button (Immediate)
1. Make sure backend is running (should see "⏰ Starting reminder cron job..." in console)
2. Open frontend at http://localhost:5173
3. Go to WorkDesk
4. Click "📧 Test Email" button
5. Check **backend console** - you should see:
   ```
   ================================================================================
   📧 EMAIL SENT (CONSOLE TRANSPORT - DEV MODE)
   ================================================================================
   To: demo@local
   Subject: Reminder: Test Reminder Email
   Task ID: 0
   Task Title: Test Reminder Email
   Priority: MEDIUM
   Reminder Time: 2024-11-02T...
   --------------------------------------------------------------------------------
   Email Body (Plain Text):
   ...
   ================================================================================
   ```

### Test 2: Real Task Reminder (2 minutes ahead)
1. In WorkDesk, click "+ Add Task"
2. Fill in task details:
   - **Title**: "Test Reminder Task"
   - **Description**: "This task should trigger a reminder in 2 minutes"
   - **Priority**: High
   - **Reminder**: Set to **2 minutes from now**
     - Example: If it's 10:30 AM, set to 10:32 AM today
3. Click "Create Task"
4. Wait 2 minutes
5. Watch the **backend console** - you should see:
   ```
   🔔 Found 1 reminder(s) to send...
   ================================================================================
   📧 EMAIL SENT (CONSOLE TRANSPORT - DEV MODE)
   ================================================================================
   To: demo@local
   Subject: Reminder: Test Reminder Task
   ...
   ```
6. The cron job runs **every minute**, so it might take up to 1 additional minute to trigger

### Test 3: Verify Reminder Only Sent Once
1. After the reminder is sent, check the database:
   ```sql
   SELECT id, title, reminder_datetime, reminder_sent FROM tasks WHERE id = [your_task_id];
   ```
2. `reminder_sent` should be `1` (true)
3. Wait another minute - the reminder should **NOT** be sent again

## 📊 Expected Console Output

### On Server Start:
```
🚀 Server running on http://localhost:4000
📊 Health check: http://localhost:4000/health
⏰ Starting reminder cron job (runs every minute)...
```

### Every Minute (when no reminders):
- *Silent (no output)*

### When Reminder Found:
```
🔔 Found 1 reminder(s) to send...
================================================================================
📧 EMAIL SENT (CONSOLE TRANSPORT - DEV MODE)
================================================================================
To: demo@local
Subject: Reminder: Test Reminder Task
Task ID: 123
Task Title: Test Reminder Task
Priority: HIGH
Reminder Time: 2024-11-02T10:32:00.000Z
--------------------------------------------------------------------------------
Email Body (Plain Text):

Task Reminder: Test Reminder Task

This task should trigger a reminder in 2 minutes

Priority: HIGH
Estimate: 30 mins

---
This is an automated reminder from your Diary2.0 WorkDesk.

================================================================================
```

## 🚀 Production Mode (Optional)

To use **real email** with SendGrid:

1. Get SendGrid API Key from https://app.sendgrid.com/
2. Add to `.env`:
   ```bash
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
   EMAIL_FROM=noreply@yourdomain.com
   ```
3. Restart backend
4. Test email will now actually send via SendGrid
5. Console output will show: `Mode: production (SendGrid)`

## 🔍 Troubleshooting

### Backend not showing cron start message
- Stop all node processes: `Get-Process node | Stop-Process -Force`
- Restart: `cd c:\dev\Diary\backend; node index.js`
- Should see "⏰ Starting reminder cron job..."

### Reminder not triggering
- Check task has `reminder_datetime` set
- Check `reminder_datetime` is in the past
- Check `reminder_sent` is `false` (0)
- Cron runs every minute, wait up to 60 seconds

### No email output in console
- Check backend terminal for errors
- Verify nodemailer and node-cron are installed
- Check migrations ran successfully: `npx knex migrate:list`

## ✅ Verification Checklist

- [ ] Backend starts with cron job message
- [ ] "📧 Test Email" button appears in WorkDesk
- [ ] Test email button sends and shows console output
- [ ] Can set reminder when creating task
- [ ] Can set reminder when editing task
- [ ] Reminder triggers within 1 minute of set time
- [ ] Email appears in console with full details
- [ ] Task `reminder_sent` updates to true
- [ ] Same reminder doesn't send twice
- [ ] Migration batch 11 completed

## 📝 Files Created/Modified

### Backend
- ✅ `backend/services/reminderService.js` - NEW
- ✅ `backend/routes/email.js` - NEW
- ✅ `backend/migrations/20241102_add_reminder_sent.js` - NEW
- ✅ `backend/index.js` - MODIFIED (import service, start cron)
- ✅ `backend/.env.example` - MODIFIED (added email vars)
- ✅ `package.json` - MODIFIED (added node-cron, nodemailer)

### Frontend
- ✅ `frontend/src/pages/work/WorkDesk.jsx` - MODIFIED (test button)
- ✅ `frontend/src/pages/work/WorkDesk.module.css` - MODIFIED (button styles)
- ✅ TaskModal already had reminder field (no changes needed)

---

**STEP 13 COMPLETE!** 🎉

Git commit: `feat(work): reminders cron + nodemailer (dev console)`
