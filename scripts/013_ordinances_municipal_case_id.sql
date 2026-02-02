-- Add municipal_case_id for idempotent ingestion (prevents duplicate ordinances from same source case)
alter table public.ordinances
  add column if not exists municipal_case_id text;

create unique index if not exists ordinances_municipal_case_id_key
  on public.ordinances(municipal_case_id)
  where municipal_case_id is not null;
