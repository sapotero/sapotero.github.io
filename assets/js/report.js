// красная точка для тестирования выравнивания
var point  = document.getElementById("point");

// канвас-элемент
var canvas = document.getElementById("report");

// настройки сетки для grid.js
var opts = {
    distance : 10,
    lineWidth : 1,
    gridColor : "rgba(10,10,10,0.03)",
    caption : false,
    horizontalLines : true,
    verticalLines : true
};

// устанавливаем ему ширину и высоту
canvas.width = canvas.parentElement.clientWidth;
canvas.height = $(document).height();

// получаем координаты и размеры
var canvasCoords = canvas.getBoundingClientRect();

// выравниваем его по сетке
canvas.style.marginLeft = ( Math.round(canvasCoords.left/opts.distance)*opts.distance-canvasCoords.left ).toString() + 'px';


var context = canvas.getContext("2d");
new Grid(opts).draw(context);

// получаем координаты мышы
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

// document.getElementById('print').addEventListener("click", function(event){
//   window.location = canvas.toDataURL("image/png");
// });


// interact.js
var test  = document.getElementById("test"), x = 0, y = 0;

interact(test)
  .draggable({
    snap: {
      targets: [
        interact.createSnapGrid({ x: opts.distance, y: opts.distance })
      ],
      range: Infinity,
      relativePoints: [ { x: 0, y: 0 } ]
    },
    inertia: true,
    restrict: {
      //restriction: test.parentNode,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
      endOnly: true
    }
  })
  .on('dragmove', function (event) {
    x += event.dx;
    y += event.dy;

    event.target.style.webkitTransform =
    event.target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';
  })
  /*.resizable({
    preserveAspectRatio: true,
    edges: { left: true, right: true, bottom: true, top: true }
  })
  .on('resizemove', function (event) {
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    target.textContent = Math.round(event.rect.width) + '×' + Math.round(event.rect.height);
  });*/