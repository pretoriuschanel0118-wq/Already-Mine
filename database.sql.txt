-- ======================================
-- ALREADY MINE DATABASE
-- ======================================


-- USER PROFILES

create table if not exists profiles (

id uuid references auth.users(id)
on delete cascade
primary key,

name text not null,

goals text[] default '{}',

energy text default '',

future text default '',

created_at timestamp default now()

);





-- SAVED AFFIRMATIONS

create table if not exists affirmations (

id bigint generated always as identity
primary key,

user_id uuid references auth.users(id)
on delete cascade,

text text not null,

created_at timestamp default now()

);





-- JOURNAL ENTRIES

create table if not exists journals (

id bigint generated always as identity
primary key,

user_id uuid references auth.users(id)
on delete cascade,

content text not null,

created_at timestamp default now()

);





-- ======================================
-- ENABLE SECURITY
-- ======================================


alter table profiles
enable row level security;


alter table affirmations
enable row level security;


alter table journals
enable row level security;





-- ======================================
-- PROFILE SECURITY
-- ======================================


create policy "Users can view own profile"

on profiles

for select

using (

auth.uid() = id

);



create policy "Users can update own profile"

on profiles

for update

using (

auth.uid() = id

);



create policy "Users can insert own profile"

on profiles

for insert

with check (

auth.uid() = id

);







-- ======================================
-- AFFIRMATION SECURITY
-- ======================================


create policy "Users view own affirmations"

on affirmations

for select

using (

auth.uid() = user_id

);



create policy "Users save own affirmations"

on affirmations

for insert

with check (

auth.uid() = user_id

);







-- ======================================
-- JOURNAL SECURITY
-- ======================================


create policy "Users view own journals"

on journals

for select

using (

auth.uid() = user_id

);



create policy "Users create own journals"

on journals

for insert

with check (

auth.uid() = user_id

);


