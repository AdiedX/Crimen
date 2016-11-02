var crimeGeoData = require('../app/data/crimeGeoData.json'),
	mongoose = require('mongoose'),
	async = require('async');

if(process.env.NODE_ENV === "production"){
  mongoose.connect('mongodb://dev.adi:moduluspass@novus.modulusmongo.net:27017/ygos9Imi');
} else{
  mongoose.connect('mongodb://localhost/crimespace');
}

var db = mongoose.connection;

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

crimeGeoData.forEach(function(crimeData) {
	Crime.create({"longitude": crimeData.longitude, "latitude": crimeData.latitude, "month": crimeData.MO, "year": crimeData.YR, "type": crimeData.CR});
});

console.log('Success...');
