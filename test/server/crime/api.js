

'use strict';

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest');

describe('GET /api/getCrimeData', function(){
	// We want to make sure our API data being exported from api.js
	// is an accessible JSON array:
	it('should respond with JSON array', function(done){

		request(app).get('/api/getCrimeData')
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function(err, res){
			if(err) return done(err);
			res.body.should.be.instanceof(Array);
			done();
		});
	});
});