const db = require('../utils/db')

const dynamicData = (dataArr) => {
  let text = '';
  let allData = dataArr.reduce((prev, next) => prev.concat(next));

  for(let i = 0; i < allData.length; i += 4){
    text += `('${allData[i]}', '${allData[i+1]}', ${allData[i+2]}, '${allData[i+3]}'), `
  }
  text = text.slice(0, -2);
  return text;
}

const index = async () => {
  const dbConn = await db.openDatabase(`${process.env.DATABASE_NAME}.sqlite3`);
  return await db.query(dbConn, `SELECT * FROM analytics;`);
}

const createMany = async (data) => {
  if(data.length > 0) {
    const newData = dynamicData(data);
    const dbConn = await db.openDatabase(`${process.env.DATABASE_NAME}.sqlite3`);
    try {
      await db.queryWithParams(dbConn, `INSERT INTO analytics (id, event, timestamp, user_id) VALUES ${newData}`);
    } catch(err) {
      console.log('ERROR: ', err)
    }
  }
}

module.exports = {
  createMany,
  index
}