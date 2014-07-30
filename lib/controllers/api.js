

// THIS IS THE API $http GETS THE DATA FROM

'use strict';
var _ = require('underscore');
var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing');
    var Crime = mongoose.model('Crime');

exports.crimeData = function(req, res) {
    return Crime.find().limit(200000).exec(function(err, crimes){
        if(!err){
            var mapOutput =  _.map(crimes, function(element){
                return{
                    id: element._id,
                    latitude: element.latitude,
                    longitude: element.longitude,
                    type: element.type,
                    month: element.month,
                    year: element.year
                };
            });
            return res.json(mapOutput);
        } else{
            res.send(500);
        }
    });
};

