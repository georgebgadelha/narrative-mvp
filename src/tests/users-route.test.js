const request = require('supertest')
const app = require('../app')
const User = require('../models/users')

describe('Testing users routes', () => {
  it('Testing GET route', async () => {
    const res = await request(app)
      .get('/users')

    expect(res.statusCode).toEqual(200);
    const userExample = res.body.data[0]
    if (res.body.data.length > 0) {
      expect(userExample).toHaveProperty('name');
      expect(userExample).toHaveProperty('email');
      expect(userExample).toHaveProperty('username');
      expect(userExample).toHaveProperty('password');
      expect(userExample).toHaveProperty('createdAt');
      expect(userExample).toHaveProperty('updatedAt');
    }

  })

  it('Testing POST route', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'George Franklin',
        email: 'franklygeorge@narrative.io',
        username: 'FranklyGeorge101',
        password: '123456',
      })
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');

    await request(app).delete(`/users/${res.body.id}`);
  })

  it('Testing UPDATE route', async () => {
    const users = await User.index();
    const id = users[0].id

    const res = await request(app)
      .put(`/users/${id}`)
      .send({
        name: 'John, the third',
      })
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('result');
  })

  it('Testing DELETE route', async () => {
    const users = await User.index();
    const id = users[0].id

    const res = await request(app)
      .delete(`/users/${id}`)
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('result');
  })

})