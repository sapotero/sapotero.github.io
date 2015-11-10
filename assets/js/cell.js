var Cell = function(items) {
  this.index       = 0;
  this.items       = items;
  this.searchQuery = "";
};
 
Cell.prototype = {
  add: function(data) {
    this.items.push(data);
    return this.next();
  },
  first: function() {
    this.reset();
    return this.next();
   },
  next: function() {
    return this.items[this.index++];
  },
  hasNext: function() {
    return this.index <= this.items.length;
  },
  reset: function() {
    this.index = 0;
  },
  each: function(callback) {
    for (var item = this.first(); this.hasNext(); item = this.next()) {
      callback(item);
    }
  }
};

var CellHeader =function(items) {
  Cell.apply(this, arguments);
  this.index       = 0;
  this.items       = items;
};


CellHeader.prototype.constructor = CellHeader;
CellHeader.prototype = Object.create(Cell.prototype, {
  run: {
    writable: true,
    configurable:true,
    value: function(){
      console.log(this);
    }
  }
});

var cell = new Cell([1,2,3,4,5]);
var cellHeader = new CellHeader([456]);

console.dir(cell);
console.dir(cellHeader);

