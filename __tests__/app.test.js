const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

const user = {
  username: 'test-user',
  photoUrl: '/some-image.jpg'
};

const post = {
  photoUrl: '/some-image.jpg',
  caption: 'new image',
  tags: ['one', 'two', 'three']
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

  }
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
        tags: ['one', 'two', 'three']
      })
      .then((res) => {
        expect(res.body).toEqual({id: "1", username: 'test-user', photoUrl: '/some-image.jpg', caption: 'new image', tags: ['one', 'two', 'three']})
      })
  })

  it('gets all posts', async () => {
    await User.insert(user);
    await request(app)
      .post('/api/v1/posts')
      .send(post)

    return request(app)
      .get('/api/v1/posts')
      .then((res) => {
        expect(res.body).toEqual([{id: "1", username: 'test-user', photoUrl: '/some-image.jpg', caption: 'new image', tags: ['one', 'two', 'three']}])
      })
  })

  it('gets a posts when given an id', async () => {
    await User.insert(user);

    await request(app)
      .post('/api/v1/posts')
      .send(post)

    await request(app)
      .post('/api/v1/comments')
      .send(comment)
      .then(console.log(comment))

    return request(app)
      .get('/api/v1/posts/1')
      .then((res) => {
        expect(res.body).toEqual(
          {
            caption: "new image",
            comments: ["this is a comment"],
            id: "1",
            photoUrl: "/some-image.jpg",
            tags: ["one", "two", "three"],
            username: "test-user"
          }
        )
      })
  })

  it('updates a posts caption when given an id', async () => {
    await User.insert(user);

    await request(app)
      .post('/api/v1/posts')
      .send(post)

    await request(app)
      .post('/api/v1/comments')
      .send(comment)
      .then(console.log(comment))

    return request(app)
      .patch('/api/v1/posts/1')
      .send({caption: "this is my new caption!!!!!"})
      .then((res) => {
        expect(res.body).toEqual(
          {
            caption: "this is my new caption!!!!!",
            id: "1",
            photoUrl: "/some-image.jpg",
            tags: ["one", "two", "three"],
            username: "test-user"
          }
        )
      })
  })

  // comment tests
  it('inserts a comment into the database via POST', async () => {
    await User.insert(user);

    await request(app)
      .post('/api/v1/posts')
      .send(post)

    return request(app)
      .post('/api/v1/comments')
      .send({
        comment: 'this is a comment',
        post: '1',
      })
      .then((res) => {
        expect(res.body).toEqual({id: '1', post: '1', commentBy: 'test-user', comment: 'this is a comment'})
      })
  })

  it('deletes a comment from the database when given an idea via DELETE', async () => {
    await User.insert(user);

    await request(app)
      .post('/api/v1/posts')
      .send(post)

    await request(app)
      .post('/api/v1/comments')
      .send(comment)

    await request(app)
      .post('/api/v1/comments')
      .send(comment2)

    return request(app)
      .delete('/api/v1/comments/1')
      .then((res) => {
        expect(res.body).toEqual({id: '1', post: '1', commentBy: 'test-user', comment: 'this is a comment'})
      })
  })


});
