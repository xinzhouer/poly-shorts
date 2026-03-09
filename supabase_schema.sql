-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Series Table
create table if not exists public.series (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  cover_url text,
  status text default 'Ongoing',
  tags text[] default '{}',
  total_episodes integer default 0,
  author text,
  rating numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Episodes Table
create table if not exists public.episodes (
  id uuid default uuid_generate_v4() primary key,
  series_id uuid references public.series(id) on delete cascade not null,
  episode_number integer not null,
  title text,
  thumbnail_url text,
  video_url text not null,
  duration integer default 0,
  likes integer default 0,
  comments integer default 0,
  shares integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.series enable row level security;
alter table public.episodes enable row level security;

-- Create Policies (Allow read for everyone, insert/update for everyone for MVP demo purposes)
-- In a real app, you'd restrict insert/update to authenticated users only
create policy "Public series are viewable by everyone" on public.series for select using (true);
create policy "Public episodes are viewable by everyone" on public.episodes for select using (true);

create policy "Anyone can insert series" on public.series for insert with check (true);
create policy "Anyone can insert episodes" on public.episodes for insert with check (true);

-- Create Storage Buckets
insert into storage.buckets (id, name, public) values ('covers', 'covers', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('videos', 'videos', true) on conflict do nothing;

-- Storage Policies
create policy "Cover images are publicly accessible" on storage.objects for select using ( bucket_id = 'covers' );
create policy "Videos are publicly accessible" on storage.objects for select using ( bucket_id = 'videos' );

create policy "Anyone can upload covers" on storage.objects for insert with check ( bucket_id = 'covers' );
create policy "Anyone can upload videos" on storage.objects for insert with check ( bucket_id = 'videos' );
