const redisUtils = require('./utils/cache');
const Analytic = require('./models/analytics');

let lock = false;

const routine = async () => {
  if(lock) return;

  lock = true;
  let dataList = await redisUtils.getAnalytics();
  console.log('LIST: ', dataList);
  await Analytic.createMany(dataList);
  await redisUtils.resetAnalytics();
  lock = false;
}

setInterval(async () => {
  routine().catch()
}, 5000)