

'use strict';

angular.module('crimespaceAngularApp')
  .controller('CrimeCtrl', function ($scope){
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10, "%");

        var svg = d3.select("#background-dim-md-10").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("/data/Burglary.csv", type, function(error, data) {
          x.domain(data.map(function(d) { return d.YEAR; }));
          y.domain([0, d3.max(data, function(d) { return parseInt(d.BURGLARY); })]);

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Frequency");
          console.log(data);
          svg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.YEAR); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) {
                console.log(parseInt(d.BURGLARY));
                return y(parseInt(d.BURGLARY)); })
              .attr("height", function(d) { return height - y(parseInt(d.BURGLARY)); });

        });

        function type(d) {
          d.frequency = +d.frequency;
          return d;
        }
    });
