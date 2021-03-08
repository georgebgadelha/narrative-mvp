const db = require('../utils/db')

const index = async () => {
  const dbConn = await db.openDatabase(`${process.env.DATABASE_NAME}.sqlite3`);
  return await db.query(dbConn, `SELECT * FROM users;`);
}

const find = async (id) => {
  const dbConn = await db.openDatabase(`${process.env.DATABASE_NAME}.sqlite3`);
  return await db.query(dbConn, `SELECT * FROM users WHERE id = '${id}'`);
}

const create = async (data) => {
  const dbConn = await db.openDatabase(`${process.env.DATABASE_NAME}.sqlite3`);
  await db.queryWithParams(dbConn, `INSERT INTO users (id, name, email, username, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?);`, data);
}

const remove = async (id) => {
  const dbConn = await db.openDatabase(`${process.env.DATABASE_NAME}.sqlite3`);
  return await db.queryWithParams(dbConn, `DELETE FROM users WHERE id = ?`, [id]);
}

const update = async (id, queryString) => {
  const dbConn = await db.openDatabase(`${process.env.DATABASE_NAME}.sqlite3`);
  return await db.queryWithParams(dbConn, `UPDATE users SET ${queryString} WHERE id = ?`, [id]);
}


module.exports = {
  create,
  index,
  update,
  remove,
  find
}