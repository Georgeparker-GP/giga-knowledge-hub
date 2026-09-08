-- Client roles receive only app-required table privileges; RLS remains the row boundary.
revoke all on table public.profiles,public.objects,public.edges,public.notes,public.tasks,public.events,public.sources,public.files,public.sync_state from anon,authenticated;
grant select,insert,update,delete on table public.profiles,public.objects,public.edges,public.notes,public.tasks,public.events,public.sources,public.files,public.sync_state to authenticated;
revoke all on table public.news_items from anon,authenticated;
grant select on table public.news_items to anon,authenticated;