

// THIS IS THE API $http GETS THE DATA FROM

'use strict';
var _ = require('underscore');
var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing');
    var Crime = mongoose.model('Crime');

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
    return Crime.find().limit(100000).exec(function(err, crimes)
    {
        // console.log(err);
        if(!err)
        {
            var mapOutput =  _.map(crimes, function(element)
            {
                return {
                    id: element._id,
                    latitude: element.latitude,
                    longitude: element.longitude,
                    type: element.type,
                    month: element.month,
                    year: element.year
                };
            });
            return res.json(mapOutput);
        }

        else
        {
            res.send(500);
        }
    });


};



// map_.map(list, iterator, [context]) Alias: collect
// Produces a new array of values by mapping each value in list through a transformation function (iterator). If the native map method exists, it will be used instead. If list is a JavaScript object, iterator's arguments will be (value, key, list).

// _.map([1, 2, 3], function(num){ return num * 3; });
// => [3, 6, 9]
// _.map({one: 1, two: 2, three: 3}, function(num, key){ return num * 3; });
// => [3, 6, 9]











