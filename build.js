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
  require.define('/action/main.coffee', function (module, exports, __dirname, __filename) {
    var bend, bender, draw, drop, events, global_map, path, renderer, test, test_curve;
    renderer = require('/action/renderer.coffee', module);
    bender = require('/action/bender.coffee', module);
    draw = renderer.draw;
    bend = bender.bend;
    test = function () {
      renderer.test();
      return bender.test();
    };
    path = [
      {
        x: 100,
        y: 100
      },
      {
        x: 360,
        y: 140
      },
      {
        x: 460,
        y: 240
      },
      {
        x: 400,
        y: 400
      },
      {
        x: 500,
        y: 300
      }
    ];
    test_curve = function () {
      var course;
      course = path;
      [
        1,
        2,
        3,
        4
      ].forEach(function () {
        return course = bend(course, path);
      });
      draw('hsl(240,90%,80%)', course);
      return console.log(course.length);
    };
    events = require('/action/events.coffee', module);
    global_map = {};
    events.on('update', function (data) {
      var course, key, result, value;
      result = [];
      for (key in data) {
        value = data[key];
        result.push(value);
      }
      course = result.concat();
      [
        1,
        2,
        3,
        4
      ].forEach(function () {
        return course = bend(course, result);
      });
      return draw('hsl(240,80%,40%)', course);
    });
    drop = require('/action/drop.coffee', module);
    drop.init(global_map, events);
    console.log('started');
  });
  require.define('/action/drop.coffee', function (module, exports, __dirname, __filename) {
    var area, count, create, dom, init, random;
    count = {
      data: 0,
      'new': function () {
        return this.data += 1;
      }
    };
    random = function (n) {
      if (null == n)
        n = 600;
      return Math.random() * n;
    };
    dom = require('/action/dom.coffee', module);
    area = dom.find('#cover');
    create = function (map, events) {
      var drop, id;
      id = count['new']();
      drop = dom.drop(id);
      area.appendChild(drop);
      map[id] = {
        elem: drop,
        x: random(),
        y: random()
      };
      drop.style.top = '' + map[id].y + 'px';
      drop.style.left = '' + map[id].x + 'px';
      drop.ondragstart = function (drag) {
      };
      drop.ondragend = function (drag) {
        drop.style.top = '' + (drag.offsetY + drop.offsetTop) + 'px';
        drop.style.left = '' + (drag.offsetX + drop.offsetLeft) + 'px';
        return console.log(map);
      };
      return drop.ondrag = function (drag) {
        var x, y;
        x = drag.offsetX + drop.offsetLeft;
        y = drag.offsetY + drop.offsetTop;
        map[id].x = x;
        map[id].y = y;
        return events.trigger('update', map);
      };
    };
    exports.init = init = function (registry, events) {
      create(registry, events);
      create(registry, events);
      create(registry, events);
      create(registry, events);
      window.expose = {};
      exports.add = expose.add = function () {
        create(registry, events);
        return events.trigger('update', registry);
      };
      return exports.remove = expose.remove = function () {
        var elem, keys, last_one;
        keys = Object.keys(registry);
        last_one = keys[keys.length - 1];
        console;
        elem = registry[last_one].elem;
        elem.parentElement.removeChild(elem);
        if (null != last_one)
          delete registry[last_one];
        return events.trigger('update', registry);
      };
    };
  });
  require.define('/action/dom.coffee', function (module, exports, __dirname, __filename) {
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
  require.define('/action/events.coffee', function (module, exports, __dirname, __filename) {
    var data;
    data = {};
    exports.on = function (name, callback) {
      if (!(null != data[name]))
        data[name] = [];
      if (!in$(callback, data[name]))
        return data[name].push(callback);
    };
    exports.trigger = function (name, args) {
      args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
      if (null != data[name])
        return data[name].forEach(function (callback) {
          return callback.apply(null, [].slice.call(args).concat());
        });
    };
    exports.remove = function (name, callback) {
      var side;
      if (null != data[name])
        if (null != callback) {
          side = [];
          data[name].forEach(function (the_one) {
            if (!(callback === the_one))
              return side.push(the_one);
          });
          if (side.length > 0) {
            return data[name] = side;
          } else {
            return delete data[name];
          }
        } else {
          return delete data[name];
        }
    };
    exports.test = function () {
      exports.on('test', function () {
        return console.log('a test');
      });
      exports.trigger('test');
      exports.remove('test');
      return exports.trigger('test');
    };
    function in$(member, list) {
      for (var i = 0, length = list.length; i < length; ++i)
        if (i in list && list[i] === member)
          return true;
      return false;
    }
  });
  require.define('/action/bender.coffee', function (module, exports, __dirname, __filename) {
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
    function in$(member, list) {
      for (var i = 0, length = list.length; i < length; ++i)
        if (i in list && list[i] === member)
          return true;
      return false;
    }
  });
  require.define('/action/renderer.coffee', function (module, exports, __dirname, __filename) {
    var draw, elem, pen, vertexes;
    elem = require('/action/dom.coffee', module).find('#paper');
    pen = elem.getContext('2d');
    vertexes = [];
    exports.draw = draw = function (color, list) {
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
      pen.strokeStyle = color;
      return pen.stroke();
    };
    exports.test = function () {
      return draw('hsla(0,0%,80%, 0.7)', [
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
      ]);
    };
    function in$(member, list) {
      for (var i = 0, length = list.length; i < length; ++i)
        if (i in list && list[i] === member)
          return true;
      return false;
    }
  });
  require('/action/main.coffee');
}.call(this, this));
/*
//@ sourceMappingURL=show/build.map
*/