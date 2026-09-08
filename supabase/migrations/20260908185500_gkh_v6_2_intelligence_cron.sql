create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

select cron.unschedule(jobid)
from cron.job
where jobname='gkh-v6-2-refresh-intelligence';

select cron.schedule(
  'gkh-v6-2-refresh-intelligence',
  '17 */3 * * *',
  $$select net.http_post(
    url := 'https://frzjfgwtubgfqkajlxri.supabase.co/functions/v1/refresh-intelligence',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'apikey','sb_publishable_TfJc5FmfwXJAQyl_7sm8fw_rhkAIxCh',
      'Authorization','Bearer sb_publishable_TfJc5FmfwXJAQyl_7sm8fw_rhkAIxCh'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 20000
  );$$
);