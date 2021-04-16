const pool = require('../utils/pool');

module.exports = class Post {
  id;
  username;
  photoUrl;
  caption;
  tags;
  comments;
  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.photoUrl = row.photo_url;
    this.caption = row.caption;
    this.tags = row.tags;
    this.comments = row.comments;
  }

  static async insert({ username, photoUrl, caption, tags }) {
    const { rows } = await pool.query(
      `
        insert into posts (username, photo_url, caption, tags) values ($1, $2, $3, $4) RETURNING *`,
      [username, photoUrl, caption, tags]
    );

    return new Post(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(`
        select * from posts`);

    return rows.map((row) => new Post(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
    select 
        username,
        posts.id,
        posts.caption, 
        posts.tags,
        posts.photo_url, 
        ARRAY_AGG(comments.comment) as comments
    from 
        posts
    right join users
    on 
        users.github_username = posts.username
    left join comments 
    on 	
        comments.post = posts.id
    where posts.id=$1
    group by posts.id`,
      [id]
    );
    console.log(id);

    return new Post(rows[0]);
  }

  static async update({ id, caption, username }) {
    const { rows } = await pool.query(
      `
        update posts
        set caption=$1
        where username=$2 and id=$3
        RETURNING *`,
      [caption, username, id]
    );

    return new Post(rows[0]);
  }

  static async delete(username, id) {
    const { rows } = await pool.query(
      `delete from posts
        where username=$1 and posts.id=$2
        RETURNING *`,
      [username, id]
    );

    return new Post(rows[0]);
  }
};
