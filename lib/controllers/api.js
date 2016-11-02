var
	mongoose = require('mongoose'),
	Crime = mongoose.model('Crime'),
	_ = require('underscore');

exports.crimeData = function(req, res) {
	return Crime.find().limit(2000).exec(function(err, crimes) {
		if(!err) {
			var mapOutput =  _.map(crimes, function(element) {
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
		} else {
			res.send(500);
		}
	});
};
