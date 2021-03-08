const User = require('../models/users');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const updateStringFactory = (userData) => {
  let text = ''
  const keys = Object.keys(userData);
  for (let key of keys) {
    text += `${key} = '${userData[key]}', `
  }
  const now = moment().valueOf();
  return text + `updatedAt = ${now}`
}

module.exports = {
  index: async (req, res) => {
    try {
      const users = await User.index();
      return res.status(200).send({ status: 'OK', data: users });
    } catch (err) {
      return res.status(500).send({ status: 'ERROR', error: 'Could not list users!', msg: err });
    }
  },
  create: async (req, res) => {
    const id = uuidv4();
    const today = moment().valueOf();

    let { name, email, username, password, createdAt } = req.body;
    if (!name || !email || !username || !password) return res.status(400).send({ error: 'Bad request! Check your data!' });
    createdAt = createdAt ? createdAt : today;

    try {
      await User.create([id, name, email, username, password, createdAt, createdAt]);
      return res.status(200).send({ status: 'OK', id });
    } catch (err) {
      return res.status(500).send({ status: 'ERROR', error: 'User could not be created!', msg: err });
    }
  },
  remove: async (req, res) => {
    const { id } = req.params;
    try {
      await User.remove([id]);
      return res.status(200).send({ status: 'OK', result: 'User removed!' });
    } catch (err) {
      return res.status(500).send({ status: 'ERROR', error: 'User could not be removed!', msg: err });
    }
  },
  update: async (req, res) => {
    const { id } = req.params;
    const newUserValues = req.body;
    const queryString = updateStringFactory(newUserValues);

    try {
      await User.update(id, queryString);
      return res.status(200).send({ status: 'OK', result: 'User updated!' });
    } catch (err) {
      return res.status(500).send({ status: 'ERROR', error: 'User could not be updated!', msg: err });
    }
  }
}