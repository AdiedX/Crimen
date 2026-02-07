'use strict';

module.exports = {
  env: 'development',
  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost/crimespace'
  }
};
