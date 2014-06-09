'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing');

/**
 * Get awesome things
 */
exports.crimeData = function(req, res) {
  // return Thing.find(function (err, things) {
  //   if (!err) {
  //     return res.json(things);
  //   } else {
  //     return res.send(err);
  //   }
  // });
  res.json([
    {
        id: "random",
        latitude: 40.7127,
        longitude: -74.0059
    }
  ]);
};