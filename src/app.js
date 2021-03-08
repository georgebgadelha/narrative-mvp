const express = require('express')
require('dotenv').config();
const db = require('./utils/db');
const mockData = require('./utils/mockData');
const cron = require('./cron');

const analyticsRoutes = require('./routes/analytics');
const usersRoutes = require('./routes/users');

const app = express();

db.init(`${process.env.DATABASE_NAME}.sqlite3`).then(() => {
  // mockData()
  //   .then(res => res ? console.log(res) : {})
  //   .catch(err => console.log('E: ', err))
})


app.use(express.json())
app.use('/analytics', analyticsRoutes)
app.use('/users', usersRoutes)


module.exports = app