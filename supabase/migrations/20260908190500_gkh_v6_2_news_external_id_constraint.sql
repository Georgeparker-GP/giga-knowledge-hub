drop index if exists public.news_items_source_external_uidx;

update public.news_items
set external_id = encode(digest(source_name || coalesce(source_url,'') || id::text,'sha256'),'hex')
where external_id is null;

alter table public.news_items alter column external_id set not null;
alter table public.news_items add constraint news_items_external_id_key unique (external_id);
