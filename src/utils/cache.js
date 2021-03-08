const redis = require('redis');
const client = redis.createClient({ host: '135.148.33.236' });
const { promisify } = require('util');

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

// let addList = [];
// let lock = false;

// const sendToRedis = async () => {
//   if (lock) return;

//   lock = true;
//   for (const callback of addList) {
//     console.log('Entrou no FOR ', addList.length);
//     await callback();
//   }
//   lock = false;
//   addList = [];
// }

const addAnalytics = async (data) => {
  if (!data) return;

  // addList.push(async () => {
  let list = await getAsync('queue') || '[]';
  list = JSON.parse(list);
  list.push(data);
  await setAsync('queue', JSON.stringify(list));
  // })

  // await sendToRedis();
}

const getAnalytics = async () => {
  let list = await getAsync('queue');
  if (list)
    return JSON.parse(list);
  else
    return [];
}

const resetAnalytics = async () => {
  await delAsync('queue');
}

module.exports = {
  addAnalytics,
  getAnalytics,
  resetAnalytics
}