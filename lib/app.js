const express = require('express');
const app = express();
app.use(require('cookie-parser')());
app.use(express.json());

app.use('/api/v1/auth', require('./controllers/auth'));
app.use('/api/v1/posts', require('./controllers/posts'));
app.use('/api/v1/comments', require('./controllers/comments'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
