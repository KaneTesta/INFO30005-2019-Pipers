const mongoose = require('mongoose');

const ATLAS_USER = process.env.ATLAS_USER || '';
const ATLAS_PASS = process.env.ATLAS_PASS || '';
const dbURI = `mongodb+srv://${ATLAS_USER}:${ATLAS_PASS}@cluster0-0uuii.azure.mongodb.net/test?retryWrites=true`;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  dbName: 'test'
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log('Database connection established!');
  },
  err => {
    console.log('Error connecting Database instance due to: ', err);
  }
);

require('./recipe');
require('./contact');
require('./storage');
require('./ingredient');
require('./user');