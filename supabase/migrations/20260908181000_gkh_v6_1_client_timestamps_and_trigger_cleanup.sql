alter table public.objects add column if not exists client_updated_at timestamptz;
alter table public.edges add column if not exists client_updated_at timestamptz;
alter table public.notes add column if not exists client_updated_at timestamptz;
alter table public.tasks add column if not exists client_updated_at timestamptz;
alter table public.events add column if not exists client_updated_at timestamptz;
alter table public.sources add column if not exists client_updated_at timestamptz;

update public.objects set client_updated_at=updated_at where client_updated_at is null;
update public.edges set client_updated_at=updated_at where client_updated_at is null;
update public.notes set client_updated_at=updated_at where client_updated_at is null;
update public.tasks set client_updated_at=updated_at where client_updated_at is null;
update public.events set client_updated_at=updated_at where client_updated_at is null;
update public.sources set client_updated_at=updated_at where client_updated_at is null;

alter table public.objects alter column client_updated_at set default now();
alter table public.edges alter column client_updated_at set default now();
alter table public.notes alter column client_updated_at set default now();
alter table public.tasks alter column client_updated_at set default now();
alter table public.events alter column client_updated_at set default now();
alter table public.sources alter column client_updated_at set default now();

alter table public.objects alter column client_updated_at set not null;
alter table public.edges alter column client_updated_at set not null;
alter table public.notes alter column client_updated_at set not null;
alter table public.tasks alter column client_updated_at set not null;
alter table public.events alter column client_updated_at set not null;
alter table public.sources alter column client_updated_at set not null;

drop trigger if exists set_updated_at on public.profiles;
drop trigger if exists set_updated_at on public.objects;
drop trigger if exists set_updated_at on public.notes;
drop trigger if exists set_updated_at on public.tasks;
drop trigger if exists set_updated_at on public.events;
drop trigger if exists set_updated_at on public.sources;

create index if not exists objects_user_client_updated_idx on public.objects(user_id,client_updated_at desc);
create index if not exists edges_user_client_updated_idx on public.edges(user_id,client_updated_at desc);
create index if not exists notes_user_client_updated_idx on public.notes(user_id,client_updated_at desc);
create index if not exists tasks_user_client_updated_idx on public.tasks(user_id,client_updated_at desc);
create index if not exists events_user_client_updated_idx on public.events(user_id,client_updated_at desc);
create index if not exists sources_user_client_updated_idx on public.sources(user_id,client_updated_at desc);