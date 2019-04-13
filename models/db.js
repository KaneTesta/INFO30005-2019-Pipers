const mongoose = require('mongoose');

// TODO: whitelist heroku on atlas
const ATLAS_PASS = process.env.ATLAS_PASS || '';
const dbURI = `mongodb+srv://endwaste:ENTk912SteNvxW99@cluster0-0uuii.azure.mongodb.net/test?retryWrites=true`;

const options = {
  useNewUrlParser: true,
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
require('./contacts');
require('./storage');
