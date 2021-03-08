const sqlite = require('sqlite3').verbose()

const openDatabase = databaseFile => new Promise((resolve, reject) => {
  const db = new sqlite.Database(databaseFile, (err) => {
    if (err) {
      reject(err)
    } else {
      resolve(db)
    }
  })
})

const init = async (databaseFile) => {
  const db = await openDatabase(databaseFile)
  const hasUsersTable = await hasTable(db, 'users');
  const hasAnalyticsTable = await hasTable(db, 'analytics');

  !hasUsersTable ? await query(db, `
    CREATE TABLE users (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );
  `).then(() => console.log('Users table ✅')) : ''

  !hasAnalyticsTable ? await query(db, `
  CREATE TABLE analytics (
    id TEXT PRIMARY KEY NOT NULL,
    event TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    user_id TEXT REFERENCES users(id)
  );
  `).then(() => console.log('Analytics table ✅')) : '' 
  
  return db

}

const hasTable = async (db, tableName) => {
  const table = await query(db, `SELECT name FROM sqlite_master WHERE type = 'table' AND name = '${tableName}';`);
  return !table.length == 0
}

const queryWithParams = (db, query, values) => new Promise((resolve, reject) => {
  db.run(query, values, err => {
    if (err) {
      reject(err)
    } else {
      resolve()
    }
  })
})

const query = (db, query) => new Promise((resolve, reject) => {
  db.all(query, (err, rows) => {
    if (err) {
      reject(err)
    } else {
      resolve(rows)
    }
  })
})

module.exports = {
  openDatabase,
  init,
  queryWithParams,
  query
}