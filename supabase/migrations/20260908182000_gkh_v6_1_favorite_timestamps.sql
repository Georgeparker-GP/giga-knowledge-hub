alter table public.objects add column if not exists favorite_updated_at timestamptz;
update public.objects set favorite_updated_at=coalesce(client_updated_at,updated_at,now()) where favorite_updated_at is null;
alter table public.objects alter column favorite_updated_at set default now();
alter table public.objects alter column favorite_updated_at set not null;
create index if not exists objects_user_favorite_updated_idx on public.objects(user_id,favorite_updated_at desc);