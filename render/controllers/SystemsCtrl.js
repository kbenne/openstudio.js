'use strict';

openstudioApp.controller('SystemsCtrl', ['$scope', '$log', 'os', function ($scope, $log, os) {

//var cola = require('../node_modules/webcola');
var d3 = require('../node_modules/d3');

var color = d3.scale.category10();

var svg = d3.select("body").append("svg")
    .attr("width", 700)
    .attr("height", 700);

var nodes = [];
var links = [];
var groups = [];

var node1 = {name: 'ashley', width: 100, height: 100};
var node2 = {name: 'kyle', width: 100, height: 100};

nodes.push(node1);
nodes.push(node2);

links.push({source: 0, target: 1});

var layout = new cola.Layout()
    .avoidOverlaps(true)
    .size([700, 700])
    .nodes(nodes)
    .links(links)
    .linkDistance(30)
    .flowLayout('x',100)
    .symmetricDiffLinkLengths(5)
    .convergenceThreshold(1e-4);

layout.start(100, 100, 100, 100, false);

nodes.forEach(function (d) {
    d.routerNode = {
        name: d.name,
        bounds: d.bounds.inflate(-20)
    };
});

var gridRouterNodes = nodes.map(function (d, i) {
    d.routerNode.id = i;
    return d.routerNode;
});

var gridRouter = new cola.GridRouter(gridRouterNodes, {
    getChildren: function (v) { return v.children; },
    getBounds: function (v) { return v.bounds; }
});

var routes = gridRouter.routeEdges(links, 5, function (e) { return e.source.routerNode.id; }, function (e) { return e.target.routerNode.id; });

var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("rect")
    .attr("class", "node")
    .attr("rx", 4).attr("ry", 4);

svg.selectAll(".node").transition()
    .attr("x", function (d) { return d.routerNode.bounds.x; })
    .attr("y", function (d) { return d.routerNode.bounds.y; })
    .attr("width", function (d) { return d.routerNode.bounds.width(); })
    .attr("height", function (d) { return d.routerNode.bounds.height(); });

svg.selectAll(".label")
  .data(nodes)
  .enter().append("text")
  .attr("class", "label")
  .text(function (d) { return d.name.replace(/^u/, ''); });

svg.selectAll(".label").transition().attr("x", function (d) { return d.routerNode.bounds.cx(); })
    .attr("y", function (d) { return d.routerNode.bounds.cy(); });

svg.selectAll('path').remove();

routes.forEach(function (route) {
    var cornerradius = 5;
    var arrowwidth = 3;
    var arrowheight = 7;
    var p = cola.GridRouter.getRoutePath(route, cornerradius, arrowwidth, arrowheight);
    var c = color(0);
    var linewidth = 2;
    if (arrowheight > 0) {
        svg.append('path')
            .attr('d', p.arrowpath + ' Z')
            .attr('stroke', '#550000')
            .attr('stroke-width', 2);
        svg.append('path')
            .attr('d', p.arrowpath)
            .attr('stroke', 'none')
            .attr('fill', c);
    }
    svg.append('path')
        .attr('d', p.routepath)
        .attr('fill', 'none')
        .attr('stroke', '#550000')
        .attr('stroke-width', linewidth + 2);
    svg.append('path')
        .attr('d', p.routepath)
        .attr('fill', 'none')
        .attr('stroke', c)
        .attr('stroke-width', linewidth);
});

//var d3 = require('../node_modules/d3');
//
//var plant = os.openstudio.model.getPlantLoops(os.model).get(0);
//
//
//var width = 2000,
//    height = 480;
//
//
//var nodes = [];
//var links = [];
//
//var supplyComps = plant.supplyComponents();
//
//for( var i = 0; i < supplyComps.size(); ++i ) {
//  nodes.push({x: 100, y: 100});
//}
//
//
//for( var i = 0; i < supplyComps.size() - 1; ++i ) {
//  links.push( {
//    source: i,
//    target: i + 1 
//  } );
//}
//


}]);
