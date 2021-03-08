const Analytic = require('../models/analytics');
const User = require('../models/users');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const redisUtils = require('../utils/cache');

const getEventsQty = async (analytics) => {
  const clicks = analytics.filter(analysis => analysis.event === 'click').length;
  const impressions = analytics.filter(analysis => analysis.event === 'impression').length;
  return [clicks, impressions]
}

const getUniqueUsersQty = async (analytics) => {
  const allUsersFromEvents = analytics.map(analysis => analysis = analysis.user_id);
  const uniqueUsers = allUsersFromEvents.filter((item, index) => allUsersFromEvents.indexOf(item) === index);
  return uniqueUsers.length;
}

const getTimeInterval = (timestamp) => {
  const currentDate = moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss');

  const date = currentDate.split(' ')[0];
  const hour = currentDate.split(' ')[1].split(':')[0];

  const beginningHour = `${date} ${hour}:00:00`;
  const endingHour = `${date} ${hour}:59:59`;

  const beginningHourTS = moment(beginningHour).format('x');
  const endingHourTS = moment(endingHour).format('x');

  return [beginningHourTS, endingHourTS];
}

module.exports = {

  index: async (req, res) => {
    const { timestamp } = req.query
    let analytics = await Analytic.index();
    const timeInterval = getTimeInterval(timestamp / 1000)
    analytics = analytics.filter(analysis => analysis.timestamp >= timeInterval[0] && analysis.timestamp <= timeInterval[1]);
    const events = await getEventsQty(analytics);
    const clicks = events[0];
    const impressions = events[1];
    const unique_users = await getUniqueUsersQty(analytics);

    return res.status(200).send({
      unique_users,
      clicks,
      impressions,
      message: `unique_users,${unique_users} clicks,${clicks} impressions,${impressions}`
    })
  },

  create: async (req, res) => {
    const id = uuidv4();
    const { timestamp, user: user_id , event } = req.query;
    if (!timestamp || !user_id || !event) return res.status(400).send({ error: 'Some data is missing, check your query!' });

    try {
      const user = await User.find(user_id);
      if (user.length > 0) {
        // await Analytic.create([id, event, timestamp, user_id]);
        await redisUtils.addAnalytics([id, event, timestamp, user_id])
        
        return res.status(204).send();
      } else {
        return res.status(400).send({ status: 'ERROR', error: 'Event could not be stored!', msg: 'User doest not exist' })
      }
    } catch (err) {
      return res.status(500).send({ status: 'ERROR', error: 'Could not store data!', msg: err });
    }

  }
}