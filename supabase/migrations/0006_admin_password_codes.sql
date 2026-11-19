-- One-time codes for admin password changes (/admin/account), resets (/admin/login/reset) and the
-- first password of a new admin (/admin/users). The code itself is never stored: only an HMAC of
-- it keyed with the server secret, so a database read cannot be replayed. Codes expire after ten
-- minutes, allow five guesses and are single use. Every code is emailed to the website owner
-- (ADMIN_OWNER_EMAIL), who hands it to the person asking.
create table if not exists public.admin_password_codes (
  id            uuid primary key,
  target_email  text        not null,
  purpose       text        not null check (purpose in ('reset', 'change', 'set')),
  requested_by  text,
  code_hash     text        not null,
  attempts      integer     not null default 0,
  expires_at    timestamptz not null,
  used_at       timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists admin_password_codes_target_idx
  on public.admin_password_codes (target_email, created_at desc);
alter table public.admin_password_codes enable row level security;
