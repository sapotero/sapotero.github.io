"use strict";

var PIXI_WIDTH  = window.innerWidth;
var PIXI_HEIGHT = window.innerHeight;

// var stage = new PIXI.Container();
// var renderer = new PIXI.WebGLRenderer(1, 1,{
// // antialiasing : true,
// // transparent  : true,
// resolution   : 1
// });
// renderer.resize(PIXI_WIDTH, PIXI_HEIGHT);

// document.body.appendChild(renderer.view);


// requestAnimFrame(animate);

// function animate() {

//   requestAnimFrame(animate);
//   renderer.render(stage);
// }

var Points = function Points(x, y) {
  var _this = this;
  this.vx = 0;
  this.vy = 0;
  this.update = function (mousePoint, Reaction, spring, friction) {
    var dx;
    var dy;
    var distance = _this.calcDistance(mousePoint, new PIXI.Point(_this.localX, _this.localY));
    if (distance < Reaction) {
      var diff = distance * -1 * (Reaction - distance) / Reaction;
      var radian = Math.atan2(mousePoint.y - _this.localY, mousePoint.x - _this.localX);
      var diffPoint = _this.calcPolar(diff, radian);
      dx = _this.localX + diffPoint.x;
      dy = _this.localY + diffPoint.y;
    } else {
      dx = _this.localX;
      dy = _this.localY;
    }
    _this.vx += (dx - _this._x) * spring;
    _this.vy += (dy - _this._y) * spring;
    _this.vx *= friction;
    _this.vy *= friction;
    _this._x += _this.vx;
    _this._y += _this.vy;
  };
  this.calcDistance = function (pt1, pt2) {
    return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
  };
  this.calcPolar = function (len, angle) {
    return new PIXI.Point(Math.cos(angle) * len, Math.sin(angle) * len);
  };
  this._x = this.localX = x;
  this._y = this.localY = y;
}

Object.defineProperty(Points.prototype, "x", {
  get: function () {
    return this._x;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(Points.prototype, "y", {
  get: function () {
    return this._y;
  },
  enumerable: true,
  configurable: true
});

var Grid = function Grid() {
  var _this = this;
  this.columns = 36;
  this.rows = 36;
  this.myArray = [];
  this.SQ = [];
  this.colors = [];
  this.position = new PIXI.Point(0, 0);
  this.reaction = 5000;
  this.spring = 0.1;
  this.friction = 0.9;
  this.gridSize = 100;

  this.dotColor = 0xff0000;
  this.fieldColor = 0xccffcc;
  this.lineColor = 0xffffff;

  this.init = function () {
    // stage
    _this.stage = new PIXI.Container();
    _this.stage.interactive = true;
    _this.renderer = new PIXI.WebGLRenderer(1, 1);

    document.getElementById('container').appendChild(_this.renderer.view );

    _this.build();
    _this.resizeCanvas();


    document.addEventListener('touchstart', _this.onTouchMove);
    document.addEventListener("touchmove", _this.onTouchMove);
    document.addEventListener('touchend', _this.onTouchEnd);
    document.addEventListener("mousemove", _this.onMouseMove);

    requestAnimFrame(_this.animate);
  };
  this.build = function () {
    _this.reaction = _this.gridSize * 1.6;
    for (var i = 0; i < _this.SQ.length; i++) {
      _this.stage.removeChild(_this.SQ[i]);
    }

    _this.myArray = [];
    _this.SQ = [];
    _this.colors = [];
    var test;

    for (var i = 0; i < _this.columns; i++) {
      for (var j = 0; j < _this.rows; j++) {
        var _point = new this.Points(_this.gridSize * i, _this.gridSize * j);
        _this.myArray.push(_point);
        test = new PIXI.Graphics();
        test.beginFill( this.dotColor );
        test.drawCircle(0, 0, 5);
        test.endFill();
        test.x = 0;
        test.y = 0;
        _this.stage.addChild(test);
        _this.SQ.push(test);

        this.colors.push(Math.floor(Math.random() * 0xffffff));
        // _this.colors.push( this.fieldColor );

      }
    }

    if (!_this.lines) {
      _this.lines = new PIXI.Graphics();
    }

    _this.stage.addChild(_this.lines);
  };
  this.onTouchMove = function (event) {
    _this.position.x = event.touches[0].pageX;
    _this.position.y = event.touches[0].pageY;
  };
  this.onTouchEnd = function (event) {
    _this.position.x = -999999;
    _this.position.y = -999999;
  };
  this.onMouseMove = function (event) {
    _this.position.x = event.pageX;
    _this.position.y = event.pageY;
  };
  this.resizeCanvas = function () {
    if (_this.renderer) {
      _this.stageWidth =  window.innerWidth;
      _this.stageHeight = window.innerHeight;
      _this.renderer.resize(_this.stageWidth -5, _this.stageHeight - 5);
      _this.columns = Math.ceil(_this.stageWidth / _this.gridSize) + 1;
      _this.rows = Math.ceil(_this.stageHeight / _this.gridSize) + 1;
      _this.build();
    }
  };
  this.animate = function () {
    for (var i = 0; i < _this.myArray.length; i++) {
      _this.myArray[i].update(_this.position, _this.reaction, _this.spring, _this.friction);
      _this.SQ[i].x = _this.myArray[i].x;
      _this.SQ[i].y = _this.myArray[i].y;
    }

    var distance = 0;
    var alfa;

    _this.lines.clear();
    _this.lines.lineStyle(2, _this.lineColor, 1);

    for (var n = 0; n < _this.columns * _this.rows; n++) {
      alfa = distance / 2;
      
      if (alfa > 1){
        alfa = 1;
      }

      _this.lines.beginFill(_this.colors[n], alfa);
      _this.lines.moveTo(_this.SQ[n].x, _this.SQ[n].y);
      
      distance = _this.calcDistance(_this.position, new PIXI.Point(_this.SQ[n].x + _this.reaction / 3, _this.SQ[n].y + _this.reaction / 3));

      if (n < (_this.columns - 1) * _this.rows) {
        _this.lines.lineTo(_this.SQ[(n + _this.rows)].x, _this.SQ[n + _this.rows].y);
        if (n % _this.rows) {
          _this.lines.lineTo(_this.SQ[(n + _this.rows - 1)].x, _this.SQ[n + _this.rows - 1].y);
          _this.lines.lineTo(_this.SQ[(n - 1)].x, _this.SQ[n - 1].y);
        }
        if (n == 2 || n == 1) {
          _this.lines.lineTo(_this.SQ[(n - 1)].x, _this.SQ[n - 1].y);
          _this.lines.lineTo(_this.SQ[n].x, _this.SQ[n].y);
        }
      }
    }

    _this.lines.endFill();
    _this.renderer.render(_this.stage);
    requestAnimFrame(_this.animate);
  };
  this.calcDistance = function (pt1, pt2) {
    return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
  };
  this.init();
}
Grid.prototype.Points = Points;




var grid = new Grid()