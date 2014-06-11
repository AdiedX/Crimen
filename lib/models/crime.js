

// CRIME SCHEMA

//________________________________________________________________
// SETTING UP THE MONGOOSE API:

// Importing the mongoose library and connecting it to a database:
var mongoose = require('mongoose');

// Database 'tripplanner' is connected to mongoose.  It's running on the local host.

// development.js does this for you:
// mongoose.connect('mongodb://localhost/crimespace');

// Error handling:
var db = mongoose.connection;   // Variable to represent the connection.

// On receiving the error event, console:
db.on('error', console.error.bind(console, 'connection error:'));

// Estasblishing the Schema:
// var Place, Hotel, ThingsToDo, Restaurant;

// Schema constructor:
var Schema = mongoose.Schema;

//________________________________________________________________
// SCHEMAS:

var crimeSchema = new Schema({
    longitude: Number,
    latitude: Number,
    type: String,
    month: Number,
    year: Number
});

// Setting up the model:
var Crime = mongoose.model('Crime', crimeSchema);

// Exporting the schema constructor/class:
module.exports = { "Crime": Crime };


