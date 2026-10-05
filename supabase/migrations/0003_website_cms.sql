-- In2IT EBS website — website content editing (instant) and the media library.
--
-- Apply with: Supabase dashboard -> SQL Editor -> paste -> Run. Safe to run more than once.
--
-- How content works: the website's own text (web/content/*.ts) stays the starting point. An edit made
-- in /admin is stored here as that item's published version and laid over the original; "Reset to
-- original" deletes the row. The website re-renders the affected pages within seconds of a save.

-- One row per edited item. collection is the content type, key identifies the item within it:
--   service / industry / partner — key = the page slug, data = the fields that were edited
--   article                      — key = the article slug, data = the whole article (new or edited)
--   leadership / offices / testimonials — key = 'list', data = the whole ordered list
create table if not exists public.cms_entries (
  collection  text        not null,
  key         text        not null,
  data        jsonb       not null,
  deleted     boolean     not null default false,  -- articles: hide one that ships with the site
  updated_at  timestamptz not null default now(),
  updated_by  text,
  primary key (collection, key)
);

-- Every saved version, so an editor can see what changed and restore an earlier one.
create table if not exists public.cms_history (
  id          uuid primary key default gen_random_uuid(),
  collection  text        not null,
  key         text        not null,
  data        jsonb,                                   -- null when the item was reset or deleted
  action      text        not null,                    -- save | reset | delete | restore
  at          timestamptz not null default now(),
  by_email    text
);
create index if not exists cms_history_item_idx on public.cms_history (collection, key, at desc);

-- Uploaded images. The file is in the public "media" bucket; this row keeps what the editor needs.
create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  path        text        not null unique,             -- object path inside the bucket
  url         text        not null,                    -- public URL the site uses
  alt         text        not null default '',
  width       integer,
  height      integer,
  bytes       integer,
  mime        text,
  created_at  timestamptz not null default now(),
  created_by  text
);
create index if not exists media_created_idx on public.media (created_at desc);

alter table public.cms_entries enable row level security;
alter table public.cms_history enable row level security;
alter table public.media       enable row level security;

-- Public bucket for website images: anyone can view a file by its URL (that is what a website image
-- is), but only the website's server, with the secret key, can upload, replace or delete.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;
