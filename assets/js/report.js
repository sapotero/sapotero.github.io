var canvas = document.getElementById("report");
var point  = document.getElementById("point");

canvas.width = canvas.parentElement.clientWidth;
canvas.height = $(document).height();

var canvasCoords = canvas.getBoundingClientRect();

var context = canvas.getContext("2d");
var opts = {
    distance : 10,
    lineWidth : 1,
    gridColor : "rgba(10,10,10,0.03)",
    caption : false,
    horizontalLines : true,
    verticalLines : true
};
new Grid(opts).draw(context);


function getCoordinates (event) {
  var canvasTop = canvas.top;
  var canvasLeft = canvas.left;



  var x = event.clientX;
  var y = event.clientY;

  // grid 10x10

  var gridIndex = [Math.round(x/opts.distance), Math.round(y/opts.distance)]

  point.style.top  = (gridIndex[1]*opts.distance).toString() + 'px';
  point.style.left = (gridIndex[0]*opts.distance).toString() + 'px';

  console.log(x, y, '->', gridIndex);



};