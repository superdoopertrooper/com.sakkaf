create table public.mailing_list_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.mailing_list_subscribers enable row level security;

comment on table public.mailing_list_subscribers is 'Coming-soon mailing list signups for SAKKAF';
