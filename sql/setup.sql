drop table if exists users cascade;
drop table if exists posts;
drop table if exists comments;
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
post text not null references posts(id),
comment text not null
);
