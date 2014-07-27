

'use strict';

var app = angular.module('crimespaceAngularApp');

app.controller('CrimeCtrl', function ($scope){
    var chartObject = {
        burglaries: {
            title: "Burglaries (2000 - 2013)",
            data: [38352,32763,31275,29110,26976,24117,23143,21762,20725,19430,18600,18720,19168,17429],
            name: "BURGLARIES"
        },
        murders: {
            title: "Murders (2000 - 2013)",
            data: [673,649,587,597,570,539,596,496,523,471,536,515,419,335],
            name: "MURDERS"
        },
        felonyAssaults: {
            title: "Felony Assaults (2000 - 2013)",
            data: [25924,23453,21147,19139,18622,17750,17309,17493,16284,16773,16956,18482,19381,20297],
            name: "FELONY ASSAULTS"
        },
        rapes: {
            title: "Rapes (2000 - 2013)",
            data: [2068,1981,2144,2070,1905,1858,1525,1351,1299,1205,1373,1420,1445,1378],
            name: "RAPES"
        },
        robberies: {
            title: "Robberies (2000 - 2013)",
            data: [32562,28202,27229,25989,24373,24722,23739,21809,22401,18601,19486,19717,20144,19128],
            name: "ROBBERIES"
        },
        grandLarcenies: {
            title: "Grand Larcenies (2000 - 2013)",
            data: [49631,46329,45771,46751,48763,48243,46625,44924,44242,39580,37835,38501,42497,45368],
            name: "GRAND LARCENIES"
        },
        GLA: {
            title: "Grand Larcenies of Motor Vehicles (2000 - 2013)",
            data: [35442, 29531, 26656, 23413, 20884, 18246, 15745, 13174, 12482, 10670, 10329, 9314, 8093, 7400],
            name: "GRAND LARCENIES OF MOTOR VEHICLES"
        }
    };

    $scope.generateChart = function(crimeType){
        $('#crime-highcharts').highcharts({
            chart: {
                type: 'column',
            },
            colors: ['#AA0036'],
            title: {
                text: chartObject[crimeType]['title']
            },
            xAxis: {
                categories: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013']
            },
            yAxis: {
                title: {
                    text: chartObject[crimeType]['name']
                }
            },
            series: [{
                name: chartObject[crimeType]['name'],
                data: chartObject[crimeType]['data']
            }]
        });
    };
});









//      D3 CODE:
        // var margin = {top: 20, right: 20, bottom: 30, left: 40},
        // width = 960 - margin.left - margin.right,
        // height = 500 - margin.top - margin.bottom;

        // var x = d3.scale.ordinal()
        //     .rangeRoundBands([0, width], .1);

        // var y = d3.scale.linear()
        //     .range([height, 0]);

        // var xAxis = d3.svg.axis()
        //     .scale(x)
        //     .orient("bottom");

        // var yAxis = d3.svg.axis()
        //     .scale(y)
        //     .orient("left")
        //     .ticks(10, "%");

        // var svg = d3.select("#background-dim-md-10").append("svg")
        //     .attr("width", width + margin.left + margin.right)
        //     .attr("height", height + margin.top + margin.bottom)
        //   .append("g")
        //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // d3.csv("/data/Burglary.csv", type, function(error, data) {
        //   x.domain(data.map(function(d) { return d.YEAR; }));
        //   y.domain([0, d3.max(data, function(d) { return parseInt(d.BURGLARY); })]);

        //   svg.append("g")
        //       .attr("class", "x axis")
        //       .attr("transform", "translate(0," + height + ")")
        //       .call(xAxis);

        //   svg.append("g")
        //       .attr("class", "y axis")
        //       .call(yAxis)
        //     .append("text")
        //       .attr("transform", "rotate(-90)")
        //       .attr("y", 6)
        //       .attr("dy", ".71em")
        //       .style("text-anchor", "end")
        //       .text("Frequency");
        //   console.log(data);
        //   svg.selectAll(".bar")
        //       .data(data)
        //     .enter().append("rect")
        //       .attr("class", "bar")
        //       .attr("x", function(d) { return x(d.YEAR); })
        //       .attr("width", x.rangeBand())
        //       .attr("y", function(d) {
        //         console.log(parseInt(d.BURGLARY));
        //         return y(parseInt(d.BURGLARY)); })
        //       .attr("height", function(d) { return height - y(parseInt(d.BURGLARY)); });

        // });

        // function type(d) {
        //   d.frequency = +d.frequency;
        //   return d;
        // }

      // GOOGLE CHART CODE:
      // google.load("visualization", "1", {packages:["corechart"]});
      // google.setOnLoadCallback(drawChart);
      // function drawChart() {
      //   var data = google.visualization.arrayToDataTable([
      //     ['Year', 'Sales', 'Expenses'],
      //     ['2004',  1000,      400],
      //     ['2005',  1170,      460],
      //     ['2006',  660,       1120],
      //     ['2007',  1030,      540]
      //   ]);

      //   var options = {
      //     title: 'Company Performance',
      //     hAxis: {title: 'Year', titleTextStyle: {color: 'red'}}
      //   };

      //   var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
      //   chart.draw(data, options);
      // }