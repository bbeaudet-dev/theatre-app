# Testing Guide for Data Sync System

## Environment Setup

Make sure all environment variables are set in Convex:

- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` - For AI extraction
- `RESEND_API_KEY` - For email reports
- `ADMIN_EMAIL` - Email to receive reports (e.g., bbeaudet0@gmail.com)

Verify they're set:

```bash
npx convex env list
```

## Manual Testing

### 1. Test Manual Sync Trigger

You can trigger a manual sync using the Convex dashboard or CLI:

**Via CLI:**

```bash
npx convex run functions/dataSync:manualSync
```

**Via Dashboard:**

1. Go to https://dashboard.convex.dev
2. Navigate to Functions
3. Find `functions/dataSync:manualSync`
4. Click "Run" button
5. Monitor the logs for progress

### 2. Test Individual Components

#### Test HTML Fetching

```bash
# This would require creating a test function, or test via manual sync
```

#### Test AI Extraction (requires sample HTML)

You can test the extraction by creating a test action that calls:

- `extractShowDataWithAI` with sample HTML content

#### Test Email Sending

The email is sent automatically after each sync. Check:

- Your email inbox (ADMIN_EMAIL)
- Spam folder
- Resend dashboard for delivery status

### 3. Verify Database Updates

After running a sync, check the database:

**Via Dashboard:**

1. Go to https://dashboard.convex.dev
2. Navigate to Data
3. Check the `shows` table for:
   - New shows added
   - Updated show information
   - `lastSyncedAt` timestamps
   - `syncSource` values

**Check Sync Reports:**

1. Navigate to Data → `syncReports` table
2. View the most recent report
3. Verify:
   - `showsScanned` count
   - `newShows`, `updatedShows`, `deletedShows` arrays
   - Any errors in the `errors` field

### 4. Test Scheduled Cron

The daily sync is scheduled to run at 2 AM UTC. To test it:

**Option 1: Wait for scheduled time**

- Set up the cron and wait for the scheduled time
- Monitor logs and email

**Option 2: Temporarily change schedule**
Edit `convex/crons.ts` to run more frequently for testing:

```typescript
crons.hourly(
  "sync-all-shows-test",
  { minuteUTC: 0 }, // Run at top of every hour
  internal.functions.dataSync.syncAllShows,
  {}
);
```

Then revert back to daily after testing.

## Expected Behavior

### Successful Sync

1. Fetches HTML from enabled sources (Playbill, Broadway.com)
2. Extracts show data using AI
3. Validates and normalizes data
4. Compares with existing shows in database
5. Inserts new shows, updates existing ones
6. Marks shows as closed if not found in sources
7. Creates sync report in database
8. Sends email report to ADMIN_EMAIL

### Error Handling

- Individual source failures don't stop the entire sync
- Errors are logged and included in the sync report
- Email report includes error section if any errors occurred
- Failed show insertions/updates are logged but don't stop the process

## Troubleshooting

### Sync Returns No Shows

- Check if data sources are enabled in `DATA_SOURCES` array
- Verify HTML fetching is working (check logs)
- Check AI API keys are valid
- Review AI extraction logs for parsing errors

### Email Not Received

- Verify `RESEND_API_KEY` is set correctly
- Check `ADMIN_EMAIL` is correct
- Check spam folder
- Verify Resend domain is configured (if using custom domain)
- Check Resend dashboard for delivery status

### AI Extraction Errors

- Verify OpenAI/Anthropic API keys are valid
- Check API rate limits
- Review AI response parsing in logs
- Test with smaller HTML samples

### Database Errors

- Verify schema matches expected structure
- Check that all required fields are provided
- Review mutation logs for specific errors

## Monitoring

### Check Logs

```bash
# View Convex logs
npx convex logs
```

### Monitor in Dashboard

1. Go to https://dashboard.convex.dev
2. Navigate to Logs
3. Filter by function name (e.g., `syncAllShows`)
4. Review execution times and errors

### Check Email Reports

Each sync sends a detailed email report with:

- Summary statistics
- List of new shows
- List of updated shows
- List of closed/deleted shows
- Any errors that occurred

## Next Steps After Testing

Once testing is successful:

1. Verify cron schedule is appropriate (currently 2 AM UTC)
2. Monitor first few automated runs closely
3. Adjust data sources if needed
4. Fine-tune AI prompts based on extraction quality
5. Set up alerts for sync failures if needed
