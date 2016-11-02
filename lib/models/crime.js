var
	mongoose = require('mongoose'),
	db = mongoose.connection;

// mongoose.connect('mongodb://localhost/crimespace');

db.on('error', console.error.bind(console, 'connection error:'));

var Schema = mongoose.Schema;

var crimeSchema = new Schema({
  longitude: Number,
  latitude: Number,
  type: String,
  month: Number,
  year: Number
});

var Crime = mongoose.model('Crime', crimeSchema);

module.exports = {
	Crime: Crime
};
