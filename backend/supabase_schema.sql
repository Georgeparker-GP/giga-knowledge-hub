-- Giga Knowledge Hub V4 — proposed production schema
create table if not exists profiles (
  id uuid primary key,
  created_at timestamptz default now()
);

create table if not exists objects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  scope text not null,
  title text not null,
  type text,
  status text,
  priority text,
  summary text,
  tags jsonb default '[]'::jsonb,
  children jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists edges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  source_id uuid not null,
  target_id uuid not null,
  relation text not null,
  created_at timestamptz default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  object_id uuid,
  body text not null,
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  object_id uuid,
  title text not null,
  status text default 'To Do',
  due_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  object_id uuid,
  title text not null,
  starts_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  scope text not null,
  name text not null,
  tier text,
  enabled boolean default true,
  priority text default 'Relevant',
  feed_url text,
  created_at timestamptz default now()
);

create table if not exists news_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  scope text not null,
  source_id uuid,
  external_id text,
  title text not null,
  url text,
  published_at timestamptz,
  raw_text text,
  summary text,
  verification text,
  priority text,
  cluster_key text,
  created_at timestamptz default now()
);

create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  object_id uuid,
  name text not null,
  storage_path text not null,
  mime_type text,
  created_at timestamptz default now()
);

-- Production should enable RLS and restrict every row to auth.uid() = user_id.
