-- Enable cron scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Remove existing job if re-running
SELECT cron.unschedule('delete-past-events') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'delete-past-events'
);

-- Schedule daily cleanup at 04:00 UTC (01:00 BRT)
SELECT cron.schedule(
  'delete-past-events',
  '0 4 * * *',
  $$ DELETE FROM public.events WHERE event_date < now() - interval '6 hours' $$
);