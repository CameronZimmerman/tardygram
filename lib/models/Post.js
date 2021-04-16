const pool = require('../utils/pool');

module.exports = class Post {
    id;
    username;
    photoUrl;
    caption;
    tags;
    constructor(row){
        this.id=  row.id;
        this.username = row.username;
        this.photoUrl = row.photo_url;
        this.caption = row.caption;
        this.tags = row.tags;
    }  

    static async insert({username,photoUrl,caption,tags}){
        const { rows } =await pool.query(`
        insert into posts (username, photo_url, caption, tags) values ($1, $2, $3, $4) RETURNING *`, [username, photoUrl,caption, tags])
        
        return new Post(rows[0]);
    };
    
};
