-- Job openings written like a full job post (as on the in2itebs Keka careers page): an overview,
-- the experience asked for, the responsibilities, the key skills and the date it was posted.
-- "description" stays the Job Description and "requirements" the Required Qualifications.
-- Safe to run more than once.

alter table public.job_openings add column if not exists overview         text not null default '';
alter table public.job_openings add column if not exists experience       text not null default '';
alter table public.job_openings add column if not exists responsibilities text not null default '';
alter table public.job_openings add column if not exists skills           text not null default '';
alter table public.job_openings add column if not exists posted_at        timestamptz;

update public.job_openings set posted_at = created_at where posted_at is null;
alter table public.job_openings alter column posted_at set default now();
alter table public.job_openings alter column posted_at set not null;
