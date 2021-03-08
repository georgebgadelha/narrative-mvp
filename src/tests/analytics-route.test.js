const request = require('supertest');
const app = require('../app');
const user = require('../models/users');
const {v4: uuidv4 } = require('uuid');

describe('Testing analytics routes', () => {
  it('Testing GET route', async () => {
    const res = await request(app)
      .get('/analytics')
      .query({ timestamp: new Date().getTime() })

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('unique_users');
    expect(res.body).toHaveProperty('clicks');
    expect(res.body).toHaveProperty('impressions');
  })

  it('Testing POST route', async () => {

    const userData = {
      id: uuidv4(),
      name: 'George Franklin',
      email: 'franklin_george@gmail.com',
      username: 'FranklyGeorge102',
      password: '123456',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    }
    const { id, name, email, username, password, createdAt, updatedAt } = userData
    await user.create([id, name, email, username, password, createdAt, updatedAt])

    const res = await request(app)
      .post('/analytics')
      .query({ 
        timestamp: new Date().getTime(),
        user: id,
        event: 'click'})

    expect(res.statusCode).toEqual(204);
    expect(res.body).toEqual({});

    user.remove(id)
  })

})