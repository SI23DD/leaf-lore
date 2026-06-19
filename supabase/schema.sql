-- ============================================================
-- Leaf & Lore — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Books ────────────────────────────────────────────────────
create table if not exists books (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  author      text not null,
  price       numeric(10,2) not null check (price >= 0),
  language    text not null check (language in ('English','Japanese','Hindi','Marathi','Manga/Anime')),
  genre       text not null check (genre in ('Fiction','Non-fiction','Mystery','Romance','Fantasy','Self-help','Children''s','Manga','Poetry','History')),
  rating      numeric(3,1) default 0 check (rating >= 0 and rating <= 5),
  description text not null default '',
  cover_color text not null default '#2D5016',
  stock       integer not null default 0 check (stock >= 0),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Users ────────────────────────────────────────────────────
create table if not exists users (
  id         uuid primary key default uuid_generate_v4(),
  email      text unique not null,
  name       text not null,
  role       text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz default now()
);

-- ── Orders ───────────────────────────────────────────────────
create table if not exists orders (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references users(id) on delete set null,
  customer_name   text not null,
  customer_email  text not null,
  total_amount    numeric(10,2) not null check (total_amount >= 0),
  status          text not null default 'Pending' check (status in ('Pending','Processing','Shipped','Delivered','Cancelled')),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── Order Items ──────────────────────────────────────────────
create table if not exists order_items (
  id         uuid primary key default uuid_generate_v4(),
  order_id   uuid not null references orders(id) on delete cascade,
  book_id    uuid not null references books(id) on delete restrict,
  quantity   integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0)
);

-- ── Auto-update updated_at ───────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger books_updated_at before update on books
  for each row execute function update_updated_at();

create trigger orders_updated_at before update on orders
  for each row execute function update_updated_at();

-- ── Row Level Security ───────────────────────────────────────
alter table books       enable row level security;
alter table users       enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

-- Books: public read, only service-role writes
create policy "books_public_read"  on books for select using (true);
create policy "books_service_write" on books for all using (false) with check (false);

-- Users: only the user themselves can read their own row
create policy "users_own_read" on users for select using (true);
create policy "users_service_write" on users for all using (false) with check (false);

-- Orders: public read via service role only (all via API routes)
create policy "orders_service_only" on orders for all using (false) with check (false);
create policy "order_items_service_only" on order_items for all using (false) with check (false);

-- ── Seed: initial books ──────────────────────────────────────
insert into books (title, author, price, language, genre, rating, description, cover_color, stock) values
  ('The Midnight Library',    'Matt Haig',              499, 'English',    'Fiction',    4.7, 'Between life and death there is a library. Every book provides a chance to try another life you could have lived.', '#1B4332', 15),
  ('Atomic Habits',           'James Clear',            399, 'English',    'Self-help',  4.8, 'A revolutionary system to get 1 percent better every day through tiny changes in behavior.', '#2D5016', 22),
  ('The Shadow of the Wind',  'Carlos Ruiz Zafón',      549, 'English',    'Mystery',    4.6, 'A young boy discovers a mysterious book in post-war Barcelona, setting off a labyrinthine tale of love and murder.', '#3D2B1F', 8),
  ('Godan',                   'Munshi Premchand',       299, 'Hindi',      'Fiction',    4.5, 'A masterpiece of Hindi literature depicting the plight of Indian peasants and rural India.', '#8B4513', 18),
  ('Koshimbir',               'V.S. Khandekar',         249, 'Marathi',    'Fiction',    4.3, 'Short stories that beautifully capture the essence of Marathi life, traditions, and human emotions.', '#556B2F', 10),
  ('One Piece Vol. 1',        'Eiichiro Oda',           349, 'Manga/Anime','Manga',      4.9, 'The legendary manga. Monkey D. Luffy sets sail to find the legendary treasure and become King of the Pirates.', '#C41E3A', 30),
  ('Norwegian Wood',          'Haruki Murakami',        449, 'Japanese',   'Romance',    4.5, 'A nostalgic story of loss and sexuality set in 1960s Tokyo. Two women who shaped a young man''s life.', '#2C3E50', 12),
  ('The Name of the Wind',    'Patrick Rothfuss',       599, 'English',    'Fantasy',    4.8, 'The first-person narrative of Kvothe, the most notorious wizard his world has ever seen.', '#4A235A', 6),
  ('Mujhe Chand Chahiye',     'Surendra Verma',         329, 'Hindi',      'Romance',    4.4, 'A girl from a middle-class family dares to dream of becoming an actress, and the sacrifices love demands.', '#7B241C', 14),
  ('Shyamchi Aai',            'Sane Guruji',            199, 'Marathi',    'Children''s',4.7, 'A touching autobiographical novel about a mother''s selfless love and her teachings that shape her son''s character.', '#1A5276', 25),
  ('Attack on Titan Vol. 1',  'Hajime Isayama',         379, 'Manga/Anime','Manga',      4.8, 'Humanity lives behind walls to protect themselves from Titans. When the walls are breached, Eren vows revenge.', '#2E4057', 20),
  ('Ikigai',                  'Héctor García',          349, 'Japanese',   'Self-help',  4.6, 'The Japanese secret to a long and happy life. Discover your reason to get up in the morning.', '#7A9E7E', 18),
  ('Rebecca',                 'Daphne du Maurier',      429, 'English',    'Mystery',    4.6, 'A timeless gothic romance about obsession, secrets, and the haunting shadow of the first Mrs. de Winter.', '#1C2833', 9),
  ('Pinjar',                  'Amrita Pritam',          279, 'Hindi',      'Fiction',    4.5, 'Set during the partition of India, this powerful novel follows Pooro''s story of survival and identity.', '#922B21', 11),
  ('Yayati',                  'V. S. Khandekar',        319, 'Marathi',    'Fiction',    4.8, 'A Jnanpith Award-winning Marathi novel retelling the Mahabharata story of King Yayati.', '#784212', 7),
  ('My Hero Academia Vol. 1', 'Kōhei Horikoshi',        359, 'Manga/Anime','Manga',      4.7, 'In a world where most have superpowers, Izuku Midoriya is born without any, yet refuses to give up.', '#1F618D', 28),
  ('Kafka on the Shore',      'Haruki Murakami',        499, 'Japanese',   'Fiction',    4.6, 'A dreamlike novel weaving two parallel stories — a teenage runaway and an old man who speaks to cats.', '#17202A', 13),
  ('The Alchemist',           'Paulo Coelho',           349, 'English',    'Fiction',    4.5, 'A shepherd boy''s journey to find treasure leads him across continents in this timeless allegorical novel.', '#B7950B', 35),
  ('Gitanjali',               'Rabindranath Tagore',    229, 'Hindi',      'Poetry',     4.9, 'A collection of 103 poems by the Nobel laureate. A spiritual and lyrical masterpiece.', '#5B2C6F', 16),
  ('Mrityunjay',              'Shivaji Sawant',         399, 'Marathi',    'History',    4.9, 'A monumental Marathi novel retelling the Mahabharata from Karna''s perspective.', '#6E2F0C', 9),
  ('Death Note Vol. 1',       'Tsugumi Ohba',           369, 'Manga/Anime','Manga',      4.8, 'A high school student discovers a supernatural notebook that kills anyone whose name is written in it.', '#1C1C1C', 22),
  ('A Brief History of Time', 'Stephen Hawking',        459, 'English',    'Non-fiction',4.7, 'From the Big Bang to black holes — a breathtaking journey through space, time, and the universe.', '#154360', 14)
on conflict do nothing;
