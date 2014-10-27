

'use strict';

describe('Controller: MainCtrl', function(){
  // Before each specification is to be tested, we load the controller's module:
  beforeEach(module('crimespaceAngularApp'));

  // Declaring variables for the controller, its scope, and the $http service:
  var MainCtrl;
  var scope;
  var $httpBackend;

  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {

    $httpBackend = _$httpBackend_;

    $httpBackend.expectGET('/api/getCrimeData').respond([
      { 
        longitude: -73.9213511988756,
        latitude: 40.69022277834554,
        month: 2,
        year: 2014,
        type: "FELONY ASSAULT"
      },
      { 
        longitude: -73.93962757133326, 
        latitude: 40.69647816776693, 
        month: 1,
        year: 2014,
        type: "GRAND LARCENY"
      }
    ]);

    scope = $rootScope.$new();

    MainCtrl = $controller('MainCtrl', { $scope: scope });

  }));

  it('should fetch two crimes from the api', function(){

    expect(scope.crimeMarkers).toBeUndefined();
    $httpBackend.flush();

    expect(scope.crimeMarkers.length).toBe(2);

    expect(scope.crimeMarkers).toEqual([
      {
        longitude: -73.9213511988756,
        latitude: 40.69022277834554,
        month: 2,
        year: 2014,
        type: "FELONY ASSAULT"        
      },
      {
        longitude: -73.93962757133326, 
        latitude: 40.69647816776693, 
        month: 1,
        year: 2014,
        type: "GRAND LARCENY"
      }
    ]);
  });

  it('sets the default location of the map at lower Manhattah', function(){
    expect(scope.map.center.latitude).toEqual(40.7127);
    expect(scope.map.center.longitude).toEqual(-74.0059);
  });

  it('should get an object from getGMap()', function(){
    expect(typeof scope.mapControl.getGMap()).toEqual("object");
  });
});











