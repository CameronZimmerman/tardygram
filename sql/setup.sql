drop table if exists users cascade;
drop table if exists posts cascade;
drop table if exists comments cascade;

create table users(
  github_username text not null primary key,
  github_photo_url text not null
);
create table posts(
id bigint generated always as identity primary key,
username text not null references users(github_username),
photo_url text not null,
caption text,
tags text[]
);
create table comments(
id bigint generated always as identity primary key,
comment_by text not null references users(github_username),
post bigint not null references posts(id) on delete cascade,
comment text not null
);
