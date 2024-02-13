const db = require('../config/connection');
const { Thought, User } = require('../models');

const userData = require('./userData.json');
const thoughtData = require('./thoughtData.json');

db.once('open', async () => {
  // clean database
  await User.deleteMany({});
  await Thought.deleteMany({});

  await User.create(userData);  
  await Thought.create(thoughtData);

  console.log('all done!');
  process.exit(0);
});
