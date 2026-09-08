-- V6.1: PostgREST upsert conflict targets require inferable full unique constraints.
drop index if exists public.edges_user_client_unique;
drop index if exists public.notes_user_client_unique;
drop index if exists public.tasks_user_client_unique;
drop index if exists public.events_user_client_unique;
drop index if exists public.sources_user_client_unique;

alter table public.edges alter column client_id set not null;
alter table public.notes alter column client_id set not null;
alter table public.tasks alter column client_id set not null;
alter table public.events alter column client_id set not null;
alter table public.sources alter column client_id set not null;

alter table public.edges add constraint edges_user_client_key unique(user_id,client_id);
alter table public.notes add constraint notes_user_client_key unique(user_id,client_id);
alter table public.tasks add constraint tasks_user_client_key unique(user_id,client_id);
alter table public.events add constraint events_user_client_key unique(user_id,client_id);
alter table public.sources add constraint sources_user_client_key unique(user_id,client_id);
