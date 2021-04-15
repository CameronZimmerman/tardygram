const pool = require('../utils/pool');

module.exports = class User {
  username;
  photoUrl;

  constructor(row) {
    this.username = row.github_username;
    this.photoUrl = row.github_photo_url;
  }

  static async insert({ username, photoUrl }) {
    const {
      rows,
    } = await pool.query(
      `insert into users (github_username, github_photo_url) values ($1, $2)`,
      [username, photoUrl]
    );

    return new User(rows[0]);
  }

  static async findByUsername(username) {
    const {
      rows,
    } = await pool.query(
      `select * from users where github_username=$1`, [username]
    );

    return new User(rows[0]);
  }
};
