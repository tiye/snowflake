
define (require, exports) ->

  width = $('#cover').width()
  height = $('#cover').height()

  console.log width, height

  half_width = width / 2
  half_height = height / 2

  center =
    x: half_width
    y: half_height

  random = ->
    Math.random() - 1

  exports.random_position = ->
    x: half_width + 0.8 * (half_width + random() * half_width)
    y: half_height + 0.8 * (half_height + random() * half_height)

  exports.w = width
  exports.h = height

  exports