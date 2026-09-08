-- Giga Knowledge Hub — production-ready Supabase schema blueprint
-- Apply only after creating a Supabase project. No secrets belong in this repository.

create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists objects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scope text not null check (scope in ('projects','logistics','football','knowledge','content')),
  title text not null,
  type text,
  status text,
  priority text,
  summary text,
  tags jsonb not null default '[]'::jsonb,
  children jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists edges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_id uuid not null references objects(id) on delete cascade,
  target_id uuid not null references objects(id) on delete cascade,
  relation text not null,
  created_at timestamptz not null default now(),
  unique(user_id, source_id, target_id, relation)
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  object_id uuid references objects(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  object_id uuid references objects(id) on delete set null,
  title text not null,
  status text not null default 'To Do' check (status in ('To Do','In Progress','Done')),
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  object_id uuid references objects(id) on delete set null,
  title text not null,
  event_type text,
  starts_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scope text not null,
  name text not null,
  tier text,
  enabled boolean not null default true,
  priority text not null default 'Relevant',
  source_url text,
  feed_url text,
  created_at timestamptz not null default now()
);

create table if not exists news_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scope text not null,
  source_id uuid references sources(id) on delete set null,
  external_id text,
  title text not null,
  url text,
  published_at timestamptz,
  raw_text text,
  summary text,
  verification text,
  priority text,
  cluster_key text,
  saved_to_knowledge boolean not null default false,
  created_at timestamptz not null default now(),
  unique(user_id, source_id, external_id)
);

create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  object_id uuid references objects(id) on delete set null,
  name text not null,
  storage_path text not null,
  mime_type text,
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists objects_user_scope_idx on objects(user_id, scope);
create index if not exists objects_user_updated_idx on objects(user_id, updated_at desc);
create index if not exists tasks_user_status_due_idx on tasks(user_id, status, due_at);
create index if not exists events_user_starts_idx on events(user_id, starts_at);
create index if not exists news_user_scope_published_idx on news_items(user_id, scope, published_at desc);
create index if not exists news_cluster_idx on news_items(user_id, cluster_key);
create index if not exists sources_user_scope_idx on sources(user_id, scope, enabled);

alter table profiles enable row level security;
alter table objects enable row level security;
alter table edges enable row level security;
alter table notes enable row level security;
alter table tasks enable row level security;
alter table events enable row level security;
alter table sources enable row level security;
alter table news_items enable row level security;
alter table files enable row level security;

create policy "profiles_own_rows" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "objects_own_rows" on objects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "edges_own_rows" on edges for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notes_own_rows" on notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks_own_rows" on tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "events_own_rows" on events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sources_own_rows" on sources for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "news_own_rows" on news_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "files_own_rows" on files for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Storage policy should be added after creating a private bucket, e.g. knowledge-files.
-- Recommended object path: <auth.uid()>/<uuid>/<filename>.
