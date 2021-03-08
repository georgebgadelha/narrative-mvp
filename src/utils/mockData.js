require('dotenv').config();
const Analytic = require('../models/analytics');
const User = require('../models/users');
const { v4: uuidv4 } = require('uuid');
const db = require('./db')
const moment = require('moment')

const usersNames = ['George', 'Luke', 'Matthew', 'John', 'Bob', 'Isaac', 'Leo', 'Bruno', 'Jake', 'Jack', 'Adrian', 'Andrew', 'Nick']
const today = moment().valueOf();

const createRandImps = async (max) => {
  for (let i = 0; i < max; i++) {
    await db.openDatabase(`${process.env.DATABASE_NAME}.sqlite3`);
    const id = uuidv4();
    const users = await User.index();
    const index = getRandomIndex(users);
    await Analytic.createMany([[id, 'impression', today, users[index].id]]);
  }
  return console.log('Impressions created!');
}

const createRandClicks = async (max) => {
  for (let i = 0; i < max; i++) {
    await db.openDatabase(`${process.env.DATABASE_NAME}.sqlite3`);
    const id = uuidv4();
    const users = await User.index();
    const index = getRandomIndex(users);
    await Analytic.createMany([[id, 'click', today, users[index].id]]);
  }
  return console.log('Clicks created!');
}

const createRandomUsers = async (max) => {
  for (let i = 0; i < max; i++) {
    await db.openDatabase(`${process.env.DATABASE_NAME}.sqlite3`);
    const id = uuidv4();
    const index = getRandomIndex(usersNames);
    const name = `${usersNames[index]}`
    const username = usernameGenerator(name)
    const email = `${username}@narrative.io`
    const password = 'narrative-mvp'
    await User.create([id, name, email, username, password, today, today])
  }
  return console.log('Users created!');
}

const usernameGenerator = (name) => {
  const rand = uuidv4().slice(0, 6);
  return `${name}_${rand}`
}

const getRandomIndex = (array) => {
  return Math.floor(Math.random() * array.length);
}

const start = async () => {
  try {
    const users = await User.index();
    if(users.length == 0){
      await createRandomUsers(10);
      await createRandImps(200);
      await createRandClicks(15);
    }
  } catch (err) {
    return { error: err }
  }
}
module.exports = start