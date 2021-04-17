const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

const user = {
  username: 'test-user',
  photoUrl: '/some-image.jpg',
};

const post = {
  photoUrl: '/some-image.jpg',
  caption: 'new image',
  tags: ['one', 'two', 'three'],
};

const comment = {
  comment: 'this is a comment',
  post: 1,
};

const comment2 = {
  comment: 'this is another comment',
  post: 1,
};

jest.mock('../lib/middleware/ensureAuth.js', () => (req, res, next) => {
  req.user = {
    username: 'test-user',
    photo_url: 'http:/some-image.jpg',
  };
  next();
});
describe('Tardygram routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  //post tests
  it('inserts a post into the database via POST', async () => {
    await User.insert(user);

    return request(app)
      .post('/api/v1/posts')
      .send({
        photoUrl: '/some-image.jpg',
        caption: 'new image',
        tags: ['one', 'two', 'three'],
      })
      .then((res) => {
        expect(res.body).toEqual({
          id: '1',
          username: 'test-user',
          photoUrl: '/some-image.jpg',
          caption: 'new image',
          tags: ['one', 'two', 'three'],
        });
      });
  });

  it('gets all posts', async () => {
    await User.insert(user);
    await request(app).post('/api/v1/posts').send(post);

    return request(app)
      .get('/api/v1/posts')
      .then((res) => {
        expect(res.body).toEqual([
          {
            id: '1',
            username: 'test-user',
            photoUrl: '/some-image.jpg',
            caption: 'new image',
            tags: ['one', 'two', 'three'],
          },
        ]);
      });
  });

  it('gets a posts when given an id', async () => {
    await User.insert(user);

    await request(app).post('/api/v1/posts').send(post);

    await request(app)
      .post('/api/v1/comments')
      .send(comment)
      .then(console.log(comment));

    return request(app)
      .get('/api/v1/posts/1')
      .then((res) => {
        expect(res.body).toEqual({
          caption: 'new image',
          comments: ['this is a comment'],
          id: '1',
          photoUrl: '/some-image.jpg',
          tags: ['one', 'two', 'three'],
          username: 'test-user',
        });
      });
  });

  it('updates a posts caption when given an id', async () => {
    await User.insert(user);

    await request(app).post('/api/v1/posts').send(post);

    await request(app)
      .post('/api/v1/comments')
      .send(comment)
      .then(console.log(comment));

    return request(app)
      .patch('/api/v1/posts/1')
      .send({ caption: 'this is my new caption!!!!!' })
      .then((res) => {
        expect(res.body).toEqual({
          caption: 'this is my new caption!!!!!',
          id: '1',
          photoUrl: '/some-image.jpg',
          tags: ['one', 'two', 'three'],
          username: 'test-user',
        });
      });
  });

  it('deletes a post from the database when given an idea via DELETE', async () => {
    await User.insert(user);

    await request(app).post('/api/v1/posts').send(post);

    await request(app).post('/api/v1/comments').send(comment);

    return request(app)
      .delete('/api/v1/posts/1')
      .then((res) => {
        expect(res.body).toEqual({
          caption: 'new image',
          id: '1',
          photoUrl: '/some-image.jpg',
          tags: ['one', 'two', 'three'],
          username: 'test-user',
        });
      });
  });

  // comment tests
  it('inserts a comment into the database via POST', async () => {
    await User.insert(user);

    await request(app).post('/api/v1/posts').send(post);

    return request(app)
      .post('/api/v1/comments')
      .send({
        comment: 'this is a comment',
        post: '1',
      })
      .then((res) => {
        expect(res.body).toEqual({
          id: '1',
          post: '1',
          commentBy: 'test-user',
          comment: 'this is a comment',
        });
      });
  });

  it('deletes a comment from the database when given an idea via DELETE', async () => {
    await User.insert(user);

    await request(app).post('/api/v1/posts').send(post);

    await request(app).post('/api/v1/comments').send(comment);

    await request(app).post('/api/v1/comments').send(comment2);

    return request(app)
      .delete('/api/v1/comments/1')
      .then((res) => {
        expect(res.body).toEqual({
          id: '1',
          post: '1',
          commentBy: 'test-user',
          comment: 'this is a comment',
        });
      });
  });

  it('gets the top 10 most popular posts from the database via GET', async () => {
    await User.insert(user);

    const postsArray = Array(20)
      .fill()
      .map((post) => {
        return request(app)
          .post('/api/v1/posts')
          .send({
            photoUrl: Math.random().toString(36).substring(7),
            caption: Math.random().toString(36).substring(7),
            tags: ['one', 'two', 'three'],
          });
      });
    const postsResults = await (await Promise.all(postsArray)).map(
      (result) => result.body
    );

    const commentsArray = Array(100)
      .fill()
      .map(() => {
        const randId = Math.floor(Math.random() * postsArray.length) + 1;
        return request(app)
          .post('/api/v1/comments')
          .send({
            comment: Math.random().toString(36).substring(7),
            post: randId,
          });
      });
    const commentsResults = await Promise.all(commentsArray);
    const resultsArr = commentsResults.map((result) => result.body);

    return request(app)
      .get('/api/v1/posts/popular')
      .then((res) => {
        expect(res.body).toEqual(expect.arrayContaining([
          {
            caption: expect.any(String),
            id: expect.any(String),
            photoUrl: expect.any(String),
            tags: ['one', 'two', 'three'],
            username: 'test-user',
            comments: expect.any(Array),
          },
        ]));
        expect(res.body.length === 10).toEqual(true);
        expect(res.body[0].comments.length > res.body[9].comments.length).toEqual(true);
      });
  });
});
