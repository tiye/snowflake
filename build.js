(function (global) {
  var process = function () {
      var cwd = '/';
      return {
        title: 'browser',
        version: 'v0.10.3',
        browser: true,
        env: {},
        argv: [],
        nextTick: function (fn) {
          setTimeout(fn, 0);
        },
        cwd: function () {
          return cwd;
        },
        chdir: function (dir) {
          cwd = dir;
        }
      };
    }();
  function require(file, parentModule) {
    if ({}.hasOwnProperty.call(require.cache, file))
      return require.cache[file];
    var resolved = require.resolve(file);
    if (!resolved)
      throw new Error('Failed to resolve module ' + file);
    var module$ = {
        id: file,
        require: require,
        filename: file,
        exports: {},
        loaded: false,
        parent: parentModule,
        children: []
      };
    if (parentModule)
      parentModule.children.push(module$);
    var dirname = file.slice(0, file.lastIndexOf('/') + 1);
    require.cache[file] = module$.exports;
    resolved.call(module$.exports, module$, module$.exports, dirname, file);
    module$.loaded = true;
    return require.cache[file] = module$.exports;
  }
  require.modules = {};
  require.cache = {};
  require.resolve = function (file) {
    return {}.hasOwnProperty.call(require.modules, file) ? require.modules[file] : void 0;
  };
  require.define = function (file, fn) {
    require.modules[file] = fn;
  };
  require.define('/coffee/main.coffee', function (module, exports, __dirname, __filename) {
    require('/coffee/render.coffee', module).test();
  });
  require.define('/coffee/render.coffee', function (module, exports, __dirname, __filename) {
    var bend, draw, elem, events, level, pen, poke, test;
    events = require('events', module);
    bend = require('/coffee/bend.coffee', module).bend;
    poke = new events.EventEmitter;
    elem = require('/coffee/dom.coffee', module).find('#paper');
    pen = elem.getContext('2d');
    level = 8;
    draw = function (list) {
      var cache$, x, y;
      pen.clearRect(0, 0, elem.offsetWidth, elem.offsetHeight);
      pen.beginPath();
      if (null != list[0]) {
        cache$ = list[0];
        x = cache$.x;
        y = cache$.y;
        pen.moveTo(x, y);
      }
      list.slice(1).forEach(function (point) {
        var cache$1;
        cache$1 = point;
        x = cache$1.x;
        y = cache$1.y;
        return pen.lineTo(x, y);
      });
      return pen.stroke();
    };
    poke.on('color', function (color) {
      return pen.strokeStyle = color;
    });
    poke.on('level', function (number) {
      return level = number;
    });
    test = function () {
      var path;
      path = [
        {
          x: 100,
          y: 10
        },
        {
          x: 20,
          y: 40
        },
        {
          x: 40,
          y: 60
        }
      ];
      return draw(path);
    };
    poke.on('render', function (data) {
      var path, template;
      path = data.concat();
      template = data.concat();
      (function () {
        var accum$;
        accum$ = [];
        for (var i$ = 1; 1 <= level ? i$ <= level : i$ >= level; 1 <= level ? ++i$ : --i$)
          accum$.push(i$);
        return accum$;
      }.apply(this, arguments)(function () {
        return path = bend(path, template);
      }));
      return draw(path);
    });
    exports.poke = poke;
    exports.test = test;
  });
  require.define('/coffee/dom.coffee', function (module, exports, __dirname, __filename) {
    exports.find = function (query) {
      return document.querySelector(query);
    };
    exports.drop = function (name) {
      var div;
      div = document.createElement('div');
      div.setAttribute('class', 'drop');
      div.setAttribute('draggable', 'true');
      div.innerText = name;
      return div;
    };
  });
  require.define('/coffee/bend.coffee', function (module, exports, __dirname, __filename) {
    var add, bend, check, conjugate, divide, each_grow, minus, multiply;
    check = function (points) {
      points = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
      return points.forEach(function (point) {
        if (!(point.x < Infinity))
          throw new Error('x');
        if (!(point.y < Infinity))
          throw new Error('y');
      });
    };
    add = function (a, b) {
      return {
        x: a.x + b.x,
        y: a.y + b.y
      };
    };
    minus = function (a, b) {
      return {
        x: a.x - b.x,
        y: a.y - b.y
      };
    };
    multiply = function (a, b) {
      return {
        x: a.x * b.x - a.y * b.y,
        y: a.x * b.y + a.y * b.x
      };
    };
    conjugate = function (a) {
      return {
        x: a.x,
        y: -a.y
      };
    };
    divide = function (a, b) {
      var denominator, numberator;
      numberator = multiply(a, conjugate(b));
      denominator = multiply(b, conjugate(b));
      if (denominator.x === 0 && denominator.y === 0) {
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
    each_grow = function (origin, destination, path) {
      var course, end, factor, result, start, whole_course;
      start = path[0];
      end = path[path.length - 1];
      course = minus(end, start);
      whole_course = minus(destination, origin);
      factor = divide(whole_course, course);
      result = [];
      path.slice(1, -1).forEach(function (a) {
        var b, c;
        b = minus(a, start);
        c = multiply(b, factor);
        return result.push(add(origin, c));
      });
      result.push(destination);
      return result;
    };
    exports.bend = bend = function (list, template) {
      var base_point, result;
      base_point = list[0];
      result = [base_point];
      list.slice(1).forEach(function (guide_point) {
        var segment;
        segment = each_grow(base_point, guide_point, template);
        result.push.apply(result, [].slice.call(segment).concat());
        return base_point = guide_point;
      });
      return result;
    };
    exports.test = function () {
      var join_point, path, print_more, print_point, show_point, test_a, test_b;
      show_point = function (point) {
        return '(' + point.x.toFixed(2) + ', ' + point.y.toFixed(2) + ')';
      };
      join_point = function (list) {
        return list.map(show_point).join(' ');
      };
      print_point = function (point) {
        return console.log(show_point(point));
      };
      print_more = function (list) {
        return console.log(join_point(list));
      };
      path = [
        {
          x: 10,
          y: 20
        },
        {
          x: 24,
          y: 30
        },
        {
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
  });
  require.define('events', function (module, exports, __dirname, __filename) {
    if (!process.EventEmitter)
      process.EventEmitter = function () {
      };
    var EventEmitter = exports.EventEmitter = process.EventEmitter;
    var isArray = typeof Array.isArray === 'function' ? Array.isArray : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]';
      };
    ;
    var defaultMaxListeners = 10;
    EventEmitter.prototype.setMaxListeners = function (n) {
      if (!this._events)
        this._events = {};
      this._events.maxListeners = n;
    };
    EventEmitter.prototype.emit = function (type) {
      if (type === 'error') {
        if (!this._events || !this._events.error || isArray(this._events.error) && !this._events.error.length) {
          if (arguments[1] instanceof Error) {
            throw arguments[1];
          } else {
            throw new Error("Uncaught, unspecified 'error' event.");
          }
          return false;
        }
      }
      if (!this._events)
        return false;
      var handler = this._events[type];
      if (!handler)
        return false;
      if (typeof handler == 'function') {
        switch (arguments.length) {
        case 1:
          handler.call(this);
          break;
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        default:
          var args = Array.prototype.slice.call(arguments, 1);
          handler.apply(this, args);
        }
        return true;
      } else if (isArray(handler)) {
        var args = Array.prototype.slice.call(arguments, 1);
        var listeners = handler.slice();
        for (var i = 0, l = listeners.length; i < l; i++) {
          listeners[i].apply(this, args);
        }
        return true;
      } else {
        return false;
      }
    };
    EventEmitter.prototype.addListener = function (type, listener) {
      if ('function' !== typeof listener) {
        throw new Error('addListener only takes instances of Function');
      }
      if (!this._events)
        this._events = {};
      this.emit('newListener', type, listener);
      if (!this._events[type]) {
        this._events[type] = listener;
      } else if (isArray(this._events[type])) {
        if (!this._events[type].warned) {
          var m;
          if (this._events.maxListeners !== undefined) {
            m = this._events.maxListeners;
          } else {
            m = defaultMaxListeners;
          }
          if (m && m > 0 && this._events[type].length > m) {
            this._events[type].warned = true;
            console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
            console.trace();
          }
        }
        this._events[type].push(listener);
      } else {
        this._events[type] = [
          this._events[type],
          listener
        ];
      }
      return this;
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.once = function (type, listener) {
      var self = this;
      self.on(type, function g() {
        self.removeListener(type, g);
        listener.apply(this, arguments);
      });
      return this;
    };
    EventEmitter.prototype.removeListener = function (type, listener) {
      if ('function' !== typeof listener) {
        throw new Error('removeListener only takes instances of Function');
      }
      if (!this._events || !this._events[type])
        return this;
      var list = this._events[type];
      if (isArray(list)) {
        var i = list.indexOf(listener);
        if (i < 0)
          return this;
        list.splice(i, 1);
        if (list.length == 0)
          delete this._events[type];
      } else if (this._events[type] === listener) {
        delete this._events[type];
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function (type) {
      if (type && this._events && this._events[type])
        this._events[type] = null;
      return this;
    };
    EventEmitter.prototype.listeners = function (type) {
      if (!this._events)
        this._events = {};
      if (!this._events[type])
        this._events[type] = [];
      if (!isArray(this._events[type])) {
        this._events[type] = [this._events[type]];
      }
      return this._events[type];
    };
  });
  require('/coffee/main.coffee');
}.call(this, this));
/*
//@ sourceMappingURL=build/build.map
*/