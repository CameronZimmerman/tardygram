drop table if exists users cascade;
create table users(
  github_username text not null primary key,
  github_photo_url text not null
);