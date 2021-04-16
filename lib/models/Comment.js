const pool = require('../utils/pool');

module.exports = class Comment {
    id;
    commentBy;
    post;
    comment;

    constructor(row) {
        this.id = row.id;
        this.commentBy = row.comment_by;
        this.post = row.post;
        this.comment = row.comment;
    }

    static async insert({commentBy, post, comment}) {
        const {rows} = await pool.query(`
        insert into comments (comment_by, post, comment) values ($1, $2, $3) RETURNING *`, [commentBy, post, comment])

        return new Comment(rows[0]);
    };

    static async delete(id) {
        const {rows} = await pool.query(`
        delete from comments where id=$1 returning *`, [id])

        return new Comment(rows[0])
    }

};
