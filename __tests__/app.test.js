const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

// jest.useFakeTimers()
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


  it('inserts a post into the database via POST', async () => {
    const user = await User.insert({
      username: 'test-user',
      photoUrl: '/some-image.jpg'
    })
    return request(app)
      .post('/api/v1/posts')
      .send({
        // username: 'test-user',
        photoUrl: '/some-image.jpg',
        caption: 'new image',
        tags: ['one', 'two', 'three']
      })
      .then((res) => {
        expect(res.body).toEqual({id: "1", username: 'test-user', photoUrl: '/some-image.jpg', caption: 'new image', tags: ['one', 'two', 'three']})
      })

  })
});
