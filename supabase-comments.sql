-- Run this once in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  author text not null check (char_length(trim(author)) between 1 and 20),
  content text not null check (char_length(trim(content)) between 1 and 300),
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

drop policy if exists "Public comments are readable" on public.comments;
create policy "Public comments are readable"
on public.comments for select
to anon
using (true);

drop policy if exists "Public comments can be created" on public.comments;
create policy "Public comments can be created"
on public.comments for insert
to anon
with check (
  char_length(trim(author)) between 1 and 20
  and char_length(trim(content)) between 1 and 300
);

-- This matches the current UI, where visitors can delete a comment.
-- For author-only deletion, add authentication instead of this public policy.
drop policy if exists "Public comments can be deleted" on public.comments;
create policy "Public comments can be deleted"
on public.comments for delete
to anon
using (true);

grant select, insert, delete on table public.comments to anon;
