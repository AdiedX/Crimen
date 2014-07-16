

var crimeGeoData = require('../app/data/crimeGeoData.json');

var mongoose = require('mongoose');
var async = require('async');

mongoose.connect('mongodb://localhost/crimespace');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var Schema = mongoose.Schema;

//________________________________________________________________
// SCHEMA:

var crimeSchema = new Schema({
    longitude: Number,
    latitude: Number,
    type: String,
    month: Number,
    year: Number
});

// Setting up the model:
var Crime = mongoose.model('Crime', crimeSchema);

// var seedData = function(){
//     async.eachSeries(crimeGeoData, function(crime, callback){
//         var crimeObject = {
//             longitude: crime.longitude,
//             latitude: crime.latitude,
//             year: crime.YR,
//             month: crime.MO,
//             type: crime.CR
//         };
//         console.log(crimeObject);
//         Crime.create(crimeObject);
//     }, function(err){
//         if(err)
//             console.log('A crime stance failed to process');
//         else
//             console.log('All crimes have been processed successfully');
//     });
// };

// seedData();

// Query the database each time:
crimeGeoData.forEach(function(crimeData) {
    Crime.create({"longitude": crimeData.longitude, "latitude": crimeData.latitude, "month": crimeData.MO, "year": crimeData.YR, "type": crimeData.CR});
});

