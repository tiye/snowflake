;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0](function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  var bend, bender, draw, drop, events, global_map, path, renderer, test, test_curve;

  renderer = require("./renderer.coffee");

  bender = require("./bender.coffee");

  draw = renderer.draw;

  bend = bender.bend;

  test = function() {
    renderer.test();
    return bender.test();
  };

  path = [
    {
      x: 100,
      y: 100
    }, {
      x: 360,
      y: 140
    }, {
      x: 460,
      y: 240
    }, {
      x: 400,
      y: 400
    }, {
      x: 500,
      y: 300
    }
  ];

  test_curve = function() {
    var course;

    course = path;
    [1, 2, 3, 4].forEach(function() {
      return course = bend(course, path);
    });
    draw("hsl(240,90%,80%)", course);
    return console.log(course.length);
  };

  events = require("./events.coffee");

  global_map = {};

  events.on("update", function(data) {
    var course, key, result, value;

    result = [];
    for (key in data) {
      value = data[key];
      result.push(value);
    }
    course = result.concat();
    [1, 2, 3, 4].forEach(function() {
      return course = bend(course, result);
    });
    return draw("hsl(240,80%,40%)", course);
  });

  drop = require("./drop.coffee");

  drop.init(global_map, events);

}).call(this);


},{"./bender.coffee":2,"./renderer.coffee":3,"./events.coffee":4,"./drop.coffee":5}],2:[function(require,module,exports){
(function() {
  var add, bend, check, conjugate, divide, each_grow, minus, multiply,
    __slice = [].slice;

  check = function() {
    var points;

    points = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return points.forEach(function(point) {
      if (!(point.x < Infinity)) {
        throw new Error("x");
      }
      if (!(point.y < Infinity)) {
        throw new Error("y");
      }
    });
  };

  add = function(a, b) {
    return {
      x: a.x + b.x,
      y: a.y + b.y
    };
  };

  minus = function(a, b) {
    return {
      x: a.x - b.x,
      y: a.y - b.y
    };
  };

  multiply = function(a, b) {
    return {
      x: (a.x * b.x) - (a.y * b.y),
      y: (a.x * b.y) + (a.y * b.x)
    };
  };

  conjugate = function(a) {
    return {
      x: a.x,
      y: -a.y
    };
  };

  divide = function(a, b) {
    var denominator, numberator;

    numberator = multiply(a, conjugate(b));
    denominator = multiply(b, conjugate(b));
    if ((denominator.x === 0) && (denominator.y === 0)) {
      return {
        x: 0,
        y: 0
      };
    } else {
      return {
        x: numberator.x / denominator.x,
        y: numberator.y / denominator.x
      };
    }
  };

  each_grow = function(origin, destination, path) {
    var course, end, factor, result, start, whole_course;

    start = path[0];
    end = path[path.length - 1];
    course = minus(end, start);
    whole_course = minus(destination, origin);
    factor = divide(whole_course, course);
    result = [];
    path.slice(1, -1).forEach(function(a) {
      var b, c;

      b = minus(a, start);
      c = multiply(b, factor);
      return result.push(add(origin, c));
    });
    result.push(destination);
    return result;
  };

  exports.bend = bend = function(list, template) {
    var base_point, result;

    base_point = list[0];
    result = [base_point];
    list.slice(1).forEach(function(guide_point) {
      var segment;

      segment = each_grow(base_point, guide_point, template);
      result.push.apply(result, segment);
      return base_point = guide_point;
    });
    return result;
  };

  exports.test = function() {
    var join_point, path, print_more, print_point, show_point, test_a, test_b;

    show_point = function(point) {
      return "(" + (point.x.toFixed(2)) + ", " + (point.y.toFixed(2)) + ")";
    };
    join_point = function(list) {
      return list.map(show_point).join(" ");
    };
    print_point = function(point) {
      return console.log(show_point(point));
    };
    print_more = function(list) {
      return console.log(join_point(list));
    };
    path = [
      {
        x: 10,
        y: 20
      }, {
        x: 24,
        y: 30
      }, {
        x: 30,
        y: 60
      }
    ];
    console.log(join_point(bend(path, path)));
    test_a = {
      x: 5,
      y: 5
    };
    return test_b = {
      x: 10,
      y: 0
    };
  };

}).call(this);


},{}],4:[function(require,module,exports){
(function() {
  var data,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  data = {};

  exports.on = function(name, callback) {
    if (data[name] == null) {
      data[name] = [];
    }
    if (__indexOf.call(data[name], callback) < 0) {
      return data[name].push(callback);
    }
  };

  exports.trigger = function() {
    var args, name;

    name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (data[name] != null) {
      return data[name].forEach(function(callback) {
        return callback.apply(null, args);
      });
    }
  };

  exports.remove = function(name, callback) {
    var side;

    if (data[name] != null) {
      if (callback != null) {
        side = [];
        data[name].forEach(function(the_one) {
          if (callback !== the_one) {
            return side.push(the_one);
          }
        });
        if (side.length > 0) {
          return data[name] = side;
        } else {
          return delete data[name];
        }
      } else {
        return delete data[name];
      }
    }
  };

  exports.test = function() {
    exports.on("test", function() {
      return console.log("a test");
    });
    exports.trigger("test");
    exports.remove("test");
    return exports.trigger("test");
  };

}).call(this);


},{}],5:[function(require,module,exports){
(function() {
  var area, count, create, dom, init, random;

  count = {
    data: 0,
    "new": function() {
      return this.data += 1;
    }
  };

  random = function(n) {
    if (n == null) {
      n = 600;
    }
    return Math.random() * n;
  };

  dom = require("./dom.coffee");

  area = dom.find("#cover");

  create = function(map, events) {
    var drop, id;

    id = count["new"]();
    drop = dom.drop(id);
    area.appendChild(drop);
    map[id] = {
      elem: drop,
      x: random(),
      y: random()
    };
    drop.style.top = "" + map[id].y + "px";
    drop.style.left = "" + map[id].x + "px";
    drop.ondragstart = function(drag) {};
    drop.ondragend = function(drag) {
      drop.style.top = "" + (drag.offsetY + drop.offsetTop) + "px";
      drop.style.left = "" + (drag.offsetX + drop.offsetLeft) + "px";
      return console.log(map);
    };
    return drop.ondrag = function(drag) {
      var x, y;

      x = drag.offsetX + drop.offsetLeft;
      y = drag.offsetY + drop.offsetTop;
      map[id].x = x;
      map[id].y = y;
      return events.trigger("update", map);
    };
  };

  exports.init = init = function(registry, events) {
    create(registry, events);
    create(registry, events);
    create(registry, events);
    create(registry, events);
    window.expose = {};
    exports.add = expose.add = function() {
      create(registry, events);
      return events.trigger("update", registry);
    };
    return exports.remove = expose.remove = function() {
      var elem, keys, last_one;

      keys = Object.keys(registry);
      last_one = keys[keys.length - 1];
      console;
      elem = registry[last_one].elem;
      elem.parentElement.removeChild(elem);
      if (last_one != null) {
        delete registry[last_one];
      }
      return events.trigger("update", registry);
    };
  };

}).call(this);


},{"./dom.coffee":6}],3:[function(require,module,exports){
(function() {
  var draw, elem, pen, vertexes;

  elem = require("./dom.coffee").find("#paper");

  pen = elem.getContext("2d");

  vertexes = [];

  exports.draw = draw = function(color, list) {
    var x, y, _ref;

    pen.clearRect(0, 0, elem.offsetWidth, elem.offsetHeight);
    pen.beginPath();
    if (list[0] != null) {
      _ref = list[0], x = _ref.x, y = _ref.y;
      pen.moveTo(x, y);
    }
    list.slice(1).forEach(function(point) {
      x = point.x, y = point.y;
      return pen.lineTo(x, y);
    });
    pen.strokeStyle = color;
    return pen.stroke();
  };

  exports.test = function() {
    return draw("hsla(0,0%,80%, 0.7)", [
      {
        x: 100,
        y: 10
      }, {
        x: 20,
        y: 40
      }, {
        x: 40,
        y: 60
      }
    ]);
  };

}).call(this);


},{"./dom.coffee":6}],6:[function(require,module,exports){
(function() {
  exports.find = function(query) {
    return document.querySelector(query);
  };

  exports.drop = function(name) {
    var div;

    div = document.createElement("div");
    div.setAttribute("class", "drop");
    div.setAttribute("draggable", "true");
    div.innerText = name;
    return div;
  };

}).call(this);


},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvb3B0L3Mvc25vd2ZsYWtlL2FjdGlvbi9tYWluLmNvZmZlZSIsIi9vcHQvcy9zbm93Zmxha2UvYWN0aW9uL2JlbmRlci5jb2ZmZWUiLCIvb3B0L3Mvc25vd2ZsYWtlL2FjdGlvbi9ldmVudHMuY29mZmVlIiwiL29wdC9zL3Nub3dmbGFrZS9hY3Rpb24vZHJvcC5jb2ZmZWUiLCIvb3B0L3Mvc25vd2ZsYWtlL2FjdGlvbi9yZW5kZXJlci5jb2ZmZWUiLCIvb3B0L3Mvc25vd2ZsYWtlL2FjdGlvbi9kb20uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0E7Q0FBQSxLQUFBLHdFQUFBOztDQUFBLENBQUEsQ0FBVyxJQUFBLENBQVgsV0FBVzs7Q0FBWCxDQUNBLENBQVMsR0FBVCxDQUFTLFVBQUE7O0NBRFQsQ0FHQSxDQUFPLENBQVAsSUFBZTs7Q0FIZixDQUlBLENBQU8sQ0FBUCxFQUFhOztDQUpiLENBTUEsQ0FBTyxDQUFQLEtBQU87Q0FDTCxHQUFBLElBQVE7Q0FDRCxHQUFQLEVBQU0sS0FBTjtDQVJGLEVBTU87O0NBTlAsQ0FVQSxDQUFPLENBQVA7S0FDRTtDQUFBLENBQUksQ0FBSixHQUFDO0NBQUQsQ0FBYSxDQUFiLEdBQVU7RUFDVixJQUZLO0NBRUwsQ0FBSSxDQUFKLEdBQUM7Q0FBRCxDQUFhLENBQWIsR0FBVTtFQUNWLElBSEs7Q0FHTCxDQUFJLENBQUosR0FBQztDQUFELENBQWEsQ0FBYixHQUFVO0VBQ1YsSUFKSztDQUlMLENBQUksQ0FBSixHQUFDO0NBQUQsQ0FBYSxDQUFiLEdBQVU7RUFDVixJQUxLO0NBS0wsQ0FBSSxDQUFKLEdBQUM7Q0FBRCxDQUFhLENBQWIsR0FBVTtNQUxMO0NBVlAsR0FBQTs7Q0FBQSxDQWtCQSxDQUFhLE1BQUEsQ0FBYjtDQUNFLEtBQUEsRUFBQTs7Q0FBQSxFQUFTLENBQVQsRUFBQTtDQUFBLEVBQ2UsQ0FBZixHQUFBLEVBQWUsR0FBVDtDQUNVLENBQVEsQ0FB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QVUsQ0FBWCxHQUFILE9BQUE7Q0FGRixJQUFrQjtDQU5sQixFQVdHLENBQUgsQ0FYQSxNQVdBO0NBQ0ksRUFBRCxHQUFILEtBQUE7Q0FsQkYsRUFLc0I7O0NBTHRCLENBb0JBLENBQWUsQ0FBZixHQUFPLEVBQVE7Q0FDUixDQUF1QixFQUE1QixPQUFBLFVBQUE7T0FDRTtDQUFBLENBQUksQ0FBSixLQUFDO0NBQUQsQ0FBWSxNQUFIO0VBQ1QsTUFGMEI7Q0FFMUIsQ0FBSSxNQUFIO0NBQUQsQ0FBVyxNQUFIO0VBQ1IsTUFIMEI7Q0FHMUIsQ0FBSSxNQUFIO0NBQUQsQ0FBVyxNQUFIO1FBSGtCO0NBRGYsS0FDYjtDQXJCRixFQW9CZTtDQXBCZjs7Ozs7QUNBQTtDQUFBLENBQUEsQ0FBZSxDQUFmLENBQWUsRUFBUixFQUFTO0NBQ0wsSUFBVCxHQUFRLEdBQVIsRUFBQTtDQURGLEVBQWU7O0NBQWYsQ0FHQSxDQUFlLENBQWYsR0FBTyxFQUFTO0NBQ2QsRUFBQSxLQUFBOztDQUFBLEVBQUEsQ0FBQSxDQUFNLEdBQVEsS0FBUjtDQUFOLENBQzBCLENBQXZCLENBQUgsRUFBQSxDQUFBLEtBQUE7Q0FEQSxDQUU4QixDQUEzQixDQUFILEVBQUEsS0FBQSxDQUFBO0NBRkEsRUFHRyxDQUFILEtBQUE7Q0FKYSxVQUtiO0NBUkYsRUFHZTtDQUhmIiwic291cmNlc0NvbnRlbnQiOlsiXG5yZW5kZXJlciA9IHJlcXVpcmUgXCIuL3JlbmRlcmVyLmNvZmZlZVwiXG5iZW5kZXIgPSByZXF1aXJlIFwiLi9iZW5kZXIuY29mZmVlXCJcblxuZHJhdyA9IHJlbmRlcmVyLmRyYXdcbmJlbmQgPSBiZW5kZXIuYmVuZFxuXG50ZXN0ID0gLT5cbiAgcmVuZGVyZXIudGVzdCgpXG4gIGJlbmRlci50ZXN0KClcblxucGF0aCA9IFtcbiAge3g6IDEwMCwgIHk6IDEwMH1cbiAge3g6IDM2MCwgIHk6IDE0MH1cbiAge3g6IDQ2MCwgIHk6IDI0MH1cbiAge3g6IDQwMCwgIHk6IDQwMH1cbiAge3g6IDUwMCwgIHk6IDMwMH1cbl1cblxudGVzdF9jdXJ2ZSA9IC0+XG4gIGNvdXJzZSA9IHBhdGhcbiAgWzEuLjRdLmZvckVhY2ggLT5cbiAgICBjb3Vyc2UgPSBiZW5kIGNvdXJzZSwgcGF0aFxuICBkcmF3IFwiaHNsKDI0MCw5MCUsODAlKVwiLCBjb3Vyc2VcbiAgY29uc29sZS5sb2cgY291cnNlLmxlbmd0aFxuXG5ldmVudHMgPSByZXF1aXJlIFwiLi9ldmVudHMuY29mZmVlXCJcbmdsb2JhbF9tYXAgPSB7fVxuXG4jIHRlc3QoKVxuIyB0ZXN0X2N1cnZlKClcbiMgZXZlbnRzLnRlc3QoKVxuXG5ldmVudHMub24gXCJ1cGRhdGVcIiwgKGRhdGEpIC0+XG4gIHJlc3VsdCA9IFtdXG4gIGZvciBrZXksIHZhbHVlIG9mIGRhdGFcbiAgICByZXN1bHQucHVzaCB2YWx1ZVxuICBjb3Vyc2UgPSByZXN1bHQuY29uY2F0KClcbiAgWzEuLjRdLmZvckVhY2ggLT5cbiAgICBjb3Vyc2UgPSBiZW5kIGNvdXJzZSwgcmVzdWx0XG4gIGRyYXcgIFwiaHNsKDI0MCw4MCUsNDAlKVwiLCBjb3Vyc2VcblxuZHJvcCA9IHJlcXVpcmUgXCIuL2Ryb3AuY29mZmVlXCJcbmRyb3AuaW5pdCBnbG9iYWxfbWFwLCBldmVudHMiLCJcbmNoZWNrID0gKHBvaW50cy4uLikgLT5cbiAgcG9pbnRzLmZvckVhY2ggKHBvaW50KSAtPlxuICAgIHVubGVzcyAocG9pbnQueCA8IEluZmluaXR5KSB0aGVuIHRocm93IG5ldyBFcnJvciBcInhcIlxuICAgIHVubGVzcyAocG9pbnQueSA8IEluZmluaXR5KSB0aGVuIHRocm93IG5ldyBFcnJvciBcInlcIlxuXG5hZGQgPSAoYSwgYikgLT5cbiAgIyBjaGVjayBhLCBiXG4gIHg6IGEueCArIGIueFxuICB5OiBhLnkgKyBiLnlcblxubWludXMgPSAoYSwgYikgLT5cbiAgIyBjaGVjayBhLCBiXG4gIHg6IGEueCAtIGIuIHhcbiAgeTogYS55IC0gYi4geVxuXG5tdWx0aXBseSA9IChhLCBiKSAtPlxuICAjIGNoZWNrIGEsIGJcbiAgeDogKGEueCAqIGIueCkgLSAoYS55ICogYi55KVxuICB5OiAoYS54ICogYi55KSArIChhLnkgKiBiLngpXG5cbmNvbmp1Z2F0ZSA9IChhKSAtPlxuICAjIGNoZWNrIGFcbiAgeDogYS54XG4gIHk6IC0gYS55XG5cbmRpdmlkZSA9IChhLCBiKSAtPlxuICAjIGNoZWNrIGEsIGJcbiAgbnVtYmVyYXRvciA9IG11bHRpcGx5IGEsIChjb25qdWdhdGUgYilcbiAgZGVub21pbmF0b3IgPSBtdWx0aXBseSBiLCAoY29uanVnYXRlIGIpXG4gIGlmIChkZW5vbWluYXRvci54IGlzIDApIGFuZCAoZGVub21pbmF0b3IueSBpcyAwKVxuICAgIHg6IDAsIHk6IDBcbiAgZWxzZVxuICAgIHg6IG51bWJlcmF0b3IueCAvIGRlbm9taW5hdG9yLnhcbiAgICB5OiBudW1iZXJhdG9yLnkgLyBkZW5vbWluYXRvci54XG5cbmVhY2hfZ3JvdyA9IChvcmlnaW4sIGRlc3RpbmF0aW9uLCBwYXRoKSAtPlxuICAjIGNvbnNvbGUubG9nIFwiZ2l2ZW5cIiwgb3JpZ2luLCBkZXN0aW5hdGlvbiwgcGF0aFxuICBzdGFydCA9IHBhdGhbMF1cbiAgZW5kID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdXG4gIGNvdXJzZSA9IG1pbnVzIGVuZCwgc3RhcnRcbiAgd2hvbGVfY291cnNlID0gbWludXMgZGVzdGluYXRpb24sIG9yaWdpblxuXG4gIGZhY3RvciA9IGRpdmlkZSB3aG9sZV9jb3Vyc2UsIGNvdXJzZVxuXG4gIHJlc3VsdCA9IFtdXG5cbiAgcGF0aFsxLi4uLTFdLmZvckVhY2ggKGEpIC0+XG4gICAgYiA9IG1pbnVzIGEsIHN0YXJ0XG4gICAgYyA9IG11bHRpcGx5IGIsIGZhY3RvclxuICAgIHJlc3VsdC5wdXNoIChhZGQgb3JpZ2luLCBjKVxuXG4gIHJlc3VsdC5wdXNoIGRlc3RpbmF0aW9uXG4gIHJlc3VsdFxuXG5leHBvcnRzLmJlbmQgPSBiZW5kID0gKGxpc3QsIHRlbXBsYXRlKSAtPlxuICBiYXNlX3BvaW50ID0gbGlzdFswXVxuICByZXN1bHQgPSBbYmFzZV9wb2ludF1cblxuICBsaXN0WzEuLl0uZm9yRWFjaCAoZ3VpZGVfcG9pbnQpIC0+XG4gICAgc2VnbWVudCA9IGVhY2hfZ3JvdyBiYXNlX3BvaW50LCBndWlkZV9wb2ludCwgdGVtcGxhdGVcbiAgICByZXN1bHQucHVzaCBzZWdtZW50Li4uXG4gICAgYmFzZV9wb2ludCA9IGd1aWRlX3BvaW50XG5cbiAgcmVzdWx0XG5cbmV4cG9ydHMudGVzdCA9IC0+XG5cbiAgc2hvd19wb2ludCA9IChwb2ludCkgLT5cbiAgICBcIigje3BvaW50LngudG9GaXhlZCAyfSwgI3twb2ludC55LnRvRml4ZWQgMn0pXCJcbiAgam9pbl9wb2ludCA9IChsaXN0KSAtPiBsaXN0Lm1hcChzaG93X3BvaW50KS5qb2luIFwiIFwiXG4gIHByaW50X3BvaW50ID0gKHBvaW50KSAtPiBjb25zb2xlLmxvZyBzaG93X3BvaW50IHBvaW50XG4gIHByaW50X21vcmUgPSAobGlzdCkgLT4gY29uc29sZS5sb2cgam9pbl9wb2ludCBsaXN0XG5cbiAgcGF0aCA9IFtcbiAgICB7eDogMTAsIHk6IDIwfVxuICAgIHt4OiAyNCwgeTogMzB9XG4gICAge3g6IDMwLCB5OiA2MH1cbiAgXVxuXG4gIGNvbnNvbGUubG9nIChqb2luX3BvaW50IChiZW5kIHBhdGgsIHBhdGgpKVxuXG4gIHRlc3RfYSA9IHg6IDUsIHk6IDVcbiAgdGVzdF9iID0geDogMTAsIHk6IDBcblxuICAjIHByaW50X3BvaW50IChkaXZpZGUgdGVzdF9hLCB0ZXN0X2IpIiwiXG5kYXRhID0ge31cblxuZXhwb3J0cy5vbiA9IChuYW1lLCBjYWxsYmFjaykgLT5cbiAgdW5sZXNzIGRhdGFbbmFtZV0/IHRoZW4gZGF0YVtuYW1lXSA9IFtdXG4gIHVubGVzcyBjYWxsYmFjayBpbiBkYXRhW25hbWVdXG4gICAgZGF0YVtuYW1lXS5wdXNoIGNhbGxiYWNrXG5cbmV4cG9ydHMudHJpZ2dlciA9IChuYW1lLCBhcmdzLi4uKSAtPlxuICBpZiBkYXRhW25hbWVdP1xuICAgIGRhdGFbbmFtZV0uZm9yRWFjaCAoY2FsbGJhY2spIC0+XG4gICAgICBjYWxsYmFjayBhcmdzLi4uXG5cbmV4cG9ydHMucmVtb3ZlID0gKG5hbWUsIGNhbGxiYWNrKSAtPlxuICBpZiBkYXRhW25hbWVdP1xuICAgIGlmIGNhbGxiYWNrP1xuICAgICAgc2lkZSA9IFtdXG4gICAgICBkYXRhW25hbWVdLmZvckVhY2ggKHRoZV9vbmUpIC0+XG4gICAgICAgIHNpZGUucHVzaCB0aGVfb25lIHVubGVzcyBjYWxsYmFjayBpcyB0aGVfb25lXG4gICAgICBpZiBzaWRlLmxlbmd0aCA+IDAgdGhlbiBkYXRhW25hbWVdID0gc2lkZVxuICAgICAgZWxzZSBkZWxldGUgZGF0YVtuYW1lXVxuICAgIGVsc2UgZGVsZXRlIGRhdGFbbmFtZV1cblxuZXhwb3J0cy50ZXN0ID0gLT5cbiAgZXhwb3J0cy5vbiBcInRlc3RcIiwgLT4gY29uc29sZS5sb2cgXCJhIHRlc3RcIlxuICBleHBvcnRzLnRyaWdnZXIgXCJ0ZXN0XCJcbiAgZXhwb3J0cy5yZW1vdmUgXCJ0ZXN0XCJcbiAgZXhwb3J0cy50cmlnZ2VyIFwidGVzdFwiIiwiXG5jb3VudCA9XG4gIGRhdGE6IDBcbiAgbmV3OiAtPiBAZGF0YSArPSAxXG5cbnJhbmRvbSA9IChuID0gNjAwKSAtPiBNYXRoLnJhbmRvbSgpICogblxuXG5kb20gPSByZXF1aXJlKFwiLi9kb20uY29mZmVlXCIpXG5hcmVhID0gZG9tLmZpbmQoXCIjY292ZXJcIilcblxuY3JlYXRlID0gKG1hcCwgZXZlbnRzKSAtPlxuICBpZCA9IGNvdW50Lm5ldygpXG4gIGRyb3AgPSBkb20uZHJvcCBpZFxuICBhcmVhLmFwcGVuZENoaWxkIGRyb3BcbiAgbWFwW2lkXSA9XG4gICAgZWxlbTogZHJvcFxuICAgIHg6IHJhbmRvbSgpXG4gICAgeTogcmFuZG9tKClcblxuICBkcm9wLnN0eWxlLnRvcCA9IFwiI3ttYXBbaWRdLnl9cHhcIlxuICBkcm9wLnN0eWxlLmxlZnQgPSBcIiN7bWFwW2lkXS54fXB4XCJcblxuICBkcm9wLm9uZHJhZ3N0YXJ0ID0gKGRyYWcpIC0+XG5cbiAgZHJvcC5vbmRyYWdlbmQgPSAoZHJhZykgLT5cbiAgICBkcm9wLnN0eWxlLnRvcCA9IFwiI3tkcmFnLm9mZnNldFkgKyBkcm9wLm9mZnNldFRvcH1weFwiXG4gICAgZHJvcC5zdHlsZS5sZWZ0ID0gXCIje2RyYWcub2Zmc2V0WCArIGRyb3Aub2Zmc2V0TGVmdH1weFwiXG4gICAgY29uc29sZS5sb2cgbWFwXG5cbiAgZHJvcC5vbmRyYWcgPSAoZHJhZykgLT5cbiAgICB4ID0gZHJhZy5vZmZzZXRYICsgZHJvcC5vZmZzZXRMZWZ0XG4gICAgeSA9IGRyYWcub2Zmc2V0WSArIGRyb3Aub2Zmc2V0VG9wXG4gICAgbWFwW2lkXS54ID0geFxuICAgIG1hcFtpZF0ueSA9IHlcbiAgICBldmVudHMudHJpZ2dlciBcInVwZGF0ZVwiLCBtYXBcblxuZXhwb3J0cy5pbml0ID0gaW5pdCA9IChyZWdpc3RyeSwgZXZlbnRzKSAtPlxuICBjcmVhdGUgcmVnaXN0cnksIGV2ZW50c1xuICBjcmVhdGUgcmVnaXN0cnksIGV2ZW50c1xuICBjcmVhdGUgcmVnaXN0cnksIGV2ZW50c1xuICBjcmVhdGUgcmVnaXN0cnksIGV2ZW50c1xuXG4gIHdpbmRvdy5leHBvc2UgPSB7fVxuICBleHBvcnRzLmFkZCA9IGV4cG9zZS5hZGQgPSAtPlxuICAgIGNyZWF0ZSByZWdpc3RyeSwgZXZlbnRzXG4gICAgZXZlbnRzLnRyaWdnZXIgXCJ1cGRhdGVcIiwgcmVnaXN0cnlcblxuICBleHBvcnRzLnJlbW92ZSA9IGV4cG9zZS5yZW1vdmUgPSAtPlxuICAgIGtleXMgPSBPYmplY3Qua2V5cyByZWdpc3RyeVxuICAgIGxhc3Rfb25lID0ga2V5c1trZXlzLmxlbmd0aCAtIDFdXG4gICAgY29uc29sZVxuICAgIGVsZW0gPSByZWdpc3RyeVtsYXN0X29uZV0uZWxlbVxuICAgIGVsZW0ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCBlbGVtXG4gICAgZGVsZXRlIHJlZ2lzdHJ5W2xhc3Rfb25lXSBpZiBsYXN0X29uZT9cbiAgICBldmVudHMudHJpZ2dlciBcInVwZGF0ZVwiLCByZWdpc3RyeVxuIiwiXG5lbGVtID0gcmVxdWlyZShcIi4vZG9tLmNvZmZlZVwiKS5maW5kIFwiI3BhcGVyXCJcbnBlbiA9IGVsZW0uZ2V0Q29udGV4dCBcIjJkXCJcblxudmVydGV4ZXMgPSBbXVxuXG5leHBvcnRzLmRyYXcgPSBkcmF3ID0gKGNvbG9yLCBsaXN0KSAtPlxuICBwZW4uY2xlYXJSZWN0IDAsIDAsIGVsZW0ub2Zmc2V0V2lkdGgsIGVsZW0ub2Zmc2V0SGVpZ2h0XG4gIHBlbi5iZWdpblBhdGgoKVxuICBpZiBsaXN0WzBdP1xuICAgIHt4LCB5fSA9IGxpc3RbMF1cbiAgICBwZW4ubW92ZVRvIHgsIHlcbiAgXG4gIGxpc3RbMS4uXS5mb3JFYWNoIChwb2ludCkgLT5cbiAgICB7eCwgeX0gPSBwb2ludFxuICAgIHBlbi5saW5lVG8geCwgeVxuICAgICMgY29uc29sZS5sb2cgeCwgeVxuXG4gIHBlbi5zdHJva2VTdHlsZSA9IGNvbG9yXG4gIHBlbi5zdHJva2UoKVxuXG5leHBvcnRzLnRlc3QgPSAtPlxuICBkcmF3IFwiaHNsYSgwLDAlLDgwJSwgMC43KVwiLCBbXG4gICAge3g6IDEwMCwgeTogMTB9XG4gICAge3g6IDIwLCB5OiA0MH1cbiAgICB7eDogNDAsIHk6IDYwfVxuICAgIF0iLCJcbmV4cG9ydHMuZmluZCA9IChxdWVyeSkgLT5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvciBxdWVyeVxuXG5leHBvcnRzLmRyb3AgPSAobmFtZSkgLT5cbiAgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICBkaXYuc2V0QXR0cmlidXRlIFwiY2xhc3NcIiwgXCJkcm9wXCJcbiAgZGl2LnNldEF0dHJpYnV0ZSBcImRyYWdnYWJsZVwiLCBcInRydWVcIlxuICBkaXYuaW5uZXJUZXh0ID0gbmFtZVxuICBkaXYiXX0=
;