// Generated by CommonJS Everywhere 0.7.0
(function (global) {
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
  var process = function () {
      var cwd = '/';
      return {
        title: 'browser',
        version: 'v0.10.5',
        browser: true,
        env: {},
        argv: [],
        nextTick: global.setImmediate || function (fn) {
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
  require.define('/coffee/main.coffee', function (module, exports, __dirname, __filename) {
    var dom, height, width;
    require('/coffee/extend.coffee', module);
    global.debug = {
      raw_mouse: false,
      wrapped_mouse: true
    };
    width = 1600;
    height = 1e3;
    dom = require('/coffee/dom.coffee', module);
    window.onload = function () {
      var drag, render;
      dom.q('#paper').setAttribute('width', width);
      dom.q('#paper').setAttribute('height', height);
      dom.q('#cover').style.width = '' + width + 'px';
      dom.q('#cover').style.height = '' + height + 'px';
      drag = require('/coffee/drag.coffee', module).chan;
      drag.emit('init');
      console.log('start');
      render = require('/coffee/render.coffee', module).chan;
      drag.on('update', function (list) {
        return render.emit('render', list);
      });
      dom.q('#more').onclick = function () {
        return drag.emit('more');
      };
      dom.q('#less').onclick = function () {
        return drag.emit('less');
      };
      dom.q('#greater').onclick = function () {
        render.emit('greater');
        return drag.emit('trigger');
      };
      dom.q('#smaller').onclick = function () {
        render.emit('smaller');
        return drag.emit('trigger');
      };
      render.emit('color', 'hsla(40,60%,60%,0.6)');
      return drag.emit('trigger');
    };
    function isOwn$(o, p) {
      return {}.hasOwnProperty.call(o, p);
    }
    function extends$(child, parent) {
      for (var key in parent)
        if (isOwn$(parent, key))
          child[key] = parent[key];
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor;
      child.__super__ = parent.prototype;
      return child;
    }
  });
  require.define('/coffee/drag.coffee', function (module, exports, __dirname, __filename) {
    var chan, dom, elem_radius, events, g, paper, Point, random, vertexes;
    events = require('events', module);
    exports.chan = chan = new events.EventEmitter;
    g = require('/node_modules/log-group/lib/index.js', module).g;
    g.set('mouse', false);
    g.set('move', false);
    g.set('watch x', false);
    g.set('points', false);
    random = function (n) {
      if (null == n)
        n = 600;
      return Math.random() * n;
    };
    elem_radius = 10;
    dom = require('/coffee/dom.coffee', module);
    paper = dom.info('#cover');
    Point = function (super$) {
      extends$(Point, super$);
      function Point(param$) {
        var instance$;
        instance$ = this;
        this.random_position = function () {
          return Point.prototype.random_position.apply(instance$, arguments);
        };
        this.get = function (a) {
          return Point.prototype.get.apply(instance$, arguments);
        };
        this.set = function (a, b) {
          return Point.prototype.set.apply(instance$, arguments);
        };
        this.mouse_move = function (a) {
          return Point.prototype.mouse_move.apply(instance$, arguments);
        };
        this.mouse_up = function () {
          return Point.prototype.mouse_up.apply(instance$, arguments);
        };
        this.mouse_down = function (a) {
          return Point.prototype.mouse_down.apply(instance$, arguments);
        };
        this.listen_mouse = function () {
          return Point.prototype.listen_mouse.apply(instance$, arguments);
        };
        this.id = param$;
        this.elem = dom.make_point(this.id);
        this.dragging = false;
        this.attrs = {};
        this.listen_mouse();
        this.random_position();
        this.emit('update');
      }
      Point.prototype.listen_mouse = function () {
        var mouse, this$, this$1, this$2, this$3;
        mouse = dom.global_mouse();
        mouse.on('down', (this$ = this, function (event) {
          if (event.target.id === this$.elem.id)
            return this$.mouse_down(event);
        }));
        mouse.on('up', (this$1 = this, function (event) {
          if (this$1.dragging)
            return this$1.mouse_up();
        }));
        mouse.on('move', (this$2 = this, function (event) {
          if (this$2.dragging)
            return this$2.mouse_move(event);
        }));
        return this.elem.onmousedown = (this$3 = this, function (event) {
          g('mouse', 'mouse down', event);
          this$3.set('on_x', event.layerX);
          return this$3.set('on_y', event.layerY);
        });
      };
      Point.prototype.mouse_down = function (event) {
        this.dragging = true;
        g('mouse', 'mouse down', event);
        this.set('start_x', event.layerX);
        return this.set('start_y', event.layerY);
      };
      Point.prototype.mouse_up = function () {
        this.dragging = false;
        return g('mouse', 'mouse up');
      };
      Point.prototype.mouse_move = function (event) {
        var now_x, now_y, pos_x, pos_y;
        if (this.dragging) {
          g('mouse', 'dragging', event);
          now_x = event.layerX;
          now_y = event.layerY;
          pos_x = now_x - this.get('start_x') - this.get('on_x');
          pos_y = now_y - this.get('start_y') - this.get('on_y');
          g('move', pos_x, pos_y);
          if (pos_x > 0 && pos_y > 0) {
            this.set('x', pos_x);
            this.set('y', pos_y);
            this.elem.style.left = '' + (pos_x + elem_radius) + 'px';
            this.elem.style.top = '' + (pos_y + elem_radius) + 'px';
            return this.emit('update');
          }
        }
      };
      Point.prototype.set = function (key, value) {
        return this[key] = value;
      };
      Point.prototype.get = function (key) {
        return this[key];
      };
      Point.prototype.random_position = function () {
        var x, y;
        x = random(paper.width);
        y = random(paper.height);
        this.set('x', x + elem_radius);
        this.set('y', y + elem_radius);
        this.elem.style.left = '' + (x - elem_radius) + 'px';
        return this.elem.style.top = '' + (y - elem_radius) + 'px';
      };
      Point.prototype.remove = function () {
        return dom.remove(this.elem);
      };
      return Point;
    }(events.EventEmitter);
    vertexes = {
      data: [],
      more: function () {
        var id, point, this$;
        console.log('more');
        id = this.data.length;
        point = new Point(id);
        this.data.push(point);
        this.notify();
        return point.on('update', (this$ = this, function () {
          return this$.notify();
        }));
      },
      less: function () {
        var point;
        point = this.data.pop();
        point.remove();
        return this.notify();
      },
      notify: function () {
        var data;
        data = [];
        this.data.forEach(function (point) {
          return data.push({
            x: point.get('x'),
            y: point.get('y')
          });
        });
        g('points', data);
        return exports.chan.emit('update', data);
      }
    };
    chan.on('init', function () {
      console.log('init');
      return [
        1,
        2,
        3,
        4
      ].map(function () {
        return vertexes.more();
      });
    });
    chan.on('more', function () {
      return vertexes.more();
    });
    chan.on('less', function () {
      return vertexes.less();
    });
    chan.on('trigger', function () {
      return vertexes.notify();
    });
    function isOwn$(o, p) {
      return {}.hasOwnProperty.call(o, p);
    }
    function extends$(child, parent) {
      for (var key in parent)
        if (isOwn$(parent, key))
          child[key] = parent[key];
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor;
      child.__super__ = parent.prototype;
      return child;
    }
  });
  require.define('/coffee/dom.coffee', function (module, exports, __dirname, __filename) {
    var events, q;
    exports.find = exports.q = q = function (query) {
      return document.querySelector(query);
    };
    exports.drop = function (name) {
      var div;
      div = document.createElement('div');
      div.setAttribute('class', 'drag');
      div.innerText = name;
      return div;
    };
    exports['new'] = function (tag) {
      if (null == tag)
        tag = 'div';
      return document.createElement(tag);
    };
    exports.make_point = function (id) {
      var elem;
      elem = document.createElement('div');
      elem.className = 'drag';
      elem.id = 'number' + id;
      elem.innerText = id;
      q('#cover').appendChild(elem);
      return elem;
    };
    exports.info = function (query) {
      var elem, height, width;
      elem = q(query);
      width = elem.offsetWidth;
      height = elem.offsetHeight;
      return {
        width: width,
        height: height
      };
    };
    events = require('events', module);
    exports.global_mouse = function () {
      var chan;
      chan = new events.EventEmitter;
      q('body').addEventListener('mousedown', function (event) {
        if (debug.raw_mouse)
          console.log('mousedown');
        return chan.emit('down', event);
      });
      q('body').addEventListener('mouseup', function (event) {
        if (debug.raw_mouse)
          console.log('mousedown');
        return chan.emit('up', event);
      });
      q('body').addEventListener('mousemove', function (event) {
        return chan.emit('move', event);
      });
      q('body').addEventListener('mouseleave', function (event) {
        if (debug.raw_mouse)
          console.log('mouseleave');
        return chan.emit('up', event);
      });
      return chan;
    };
    exports.remove = function (elem) {
      return elem.parentElement.removeChild(elem);
    };
    function isOwn$(o, p) {
      return {}.hasOwnProperty.call(o, p);
    }
    function extends$(child, parent) {
      for (var key in parent)
        if (isOwn$(parent, key))
          child[key] = parent[key];
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor;
      child.__super__ = parent.prototype;
      return child;
    }
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
  require.define('/coffee/extend.coffee', function (module, exports, __dirname, __filename) {
    var g;
    Array.prototype.remove = function (item) {
      var all, one;
      all = [];
      for (var i$ = 0, length$ = this.length; i$ < length$; ++i$) {
        one = this[i$];
        if (!(one === item))
          all.push(one);
      }
      return all;
    };
    window.global = {};
    g = require('/node_modules/log-group/lib/index.js', module).g;
    g.attrs = { mouse: true };
    function isOwn$(o, p) {
      return {}.hasOwnProperty.call(o, p);
    }
    function extends$(child, parent) {
      for (var key in parent)
        if (isOwn$(parent, key))
          child[key] = parent[key];
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor;
      child.__super__ = parent.prototype;
      return child;
    }
  });
  require.define('/node_modules/log-group/lib/index.js', function (module, exports, __dirname, __filename) {
    var g, __slice = [].slice;
    g = function () {
      var args, name;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (g.attrs[name] != null) {
        if (g.attrs[name]) {
          return console.log.apply(console, ['' + name + '\t>>>\t'].concat(__slice.call(args)));
        }
      } else {
        return console.log('' + name + '\t:::\t is not implemented in log-group');
      }
    };
    g.attrs = {};
    g.set = function (name, status) {
      return g.attrs[name] = status;
    };
    exports.g = g;
  });
  require.define('/coffee/render.coffee', function (module, exports, __dirname, __filename) {
    var bend, chan, draw, elem, events, level, pen, test;
    events = require('events', module);
    bend = require('/coffee/bend.coffee', module).bend;
    chan = new events.EventEmitter;
    elem = require('/coffee/dom.coffee', module).find('#paper');
    pen = elem.getContext('2d');
    level = 5;
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
    chan.on('color', function (color) {
      return pen.strokeStyle = color;
    });
    chan.on('level', function (number) {
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
    chan.on('render', function (data) {
      var path, template;
      path = JSON.parse(JSON.stringify(data));
      template = JSON.parse(JSON.stringify(data));
      (function () {
        var accum$;
        accum$ = [];
        for (var i$ = 1; 1 <= level ? i$ <= level : i$ >= level; 1 <= level ? ++i$ : --i$)
          accum$.push(i$);
        return accum$;
      }.apply(this, arguments).forEach(function () {
        return path = bend(path, template);
      }));
      return draw(path);
    });
    chan.on('greater', function () {
      return level += 1;
    });
    chan.on('smaller', function () {
      return level -= 1;
    });
    exports.chan = chan;
    exports.test = test;
    function isOwn$(o, p) {
      return {}.hasOwnProperty.call(o, p);
    }
    function extends$(child, parent) {
      for (var key in parent)
        if (isOwn$(parent, key))
          child[key] = parent[key];
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor;
      child.__super__ = parent.prototype;
      return child;
    }
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
    function isOwn$(o, p) {
      return {}.hasOwnProperty.call(o, p);
    }
    function extends$(child, parent) {
      for (var key in parent)
        if (isOwn$(parent, key))
          child[key] = parent[key];
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor;
      child.__super__ = parent.prototype;
      return child;
    }
  });
  require('/coffee/main.coffee');
}.call(this, this));
/*
//@ sourceMappingURL=build.map
*/