-- Enable the storage extension if not already enabled
create extension if not exists "storage";

-- Create series table
create table public.series (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text null,
  cover_url text null,
  author_id uuid null, -- Can be linked to auth.users.id later
  likes integer default 0,
  created_at timestamp with time zone not null default now(),
  constraint series_pkey primary key (id)
);

-- Create episodes table
create table public.episodes (
  id uuid not null default gen_random_uuid (),
  series_id uuid not null,
  title text not null,
  video_url text not null,
  "order" integer not null default 0,
  duration text null,
  created_at timestamp with time zone not null default now(),
  constraint episodes_pkey primary key (id),
  constraint episodes_series_id_fkey foreign key (series_id) references public.series (id) on delete cascade
);

-- Create storage buckets
insert into storage.buckets (id, name, public) values ('covers', 'covers', true) ON CONFLICT (id) DO NOTHING;
insert into storage.buckets (id, name, public) values ('videos', 'videos', true) ON CONFLICT (id) DO NOTHING;

-- Enable RLS on tables
alter table public.series enable row level security;
alter table public.episodes enable row level