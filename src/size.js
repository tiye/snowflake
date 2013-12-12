// Generated by CoffeeScript 1.6.3
define(function(require, exports) {
  var center, half_height, half_width, height, random, width;
  width = $('#cover').width();
  height = $('#cover').height();
  console.log(width, height);
  half_width = width / 2;
  half_height = height / 2;
  center = {
    x: half_width,
    y: half_height
  };
  random = function() {
    return Math.random() - 1;
  };
  exports.random_position = function() {
    return {
      x: half_width + 0.8 * (half_width + random() * half_width),
      y: half_height + 0.8 * (half_height + random() * half_height)
    };
  };
  exports.w = width;
  exports.h = height;
  return exports;
});

/*
//@ sourceMappingURL=size.map
*/