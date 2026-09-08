delete from public.tombstones t
where t.entity_type='edge'
  and not exists (
    select 1 from public.edges e
    where e.user_id=t.user_id and e.client_id=t.client_id
  );
