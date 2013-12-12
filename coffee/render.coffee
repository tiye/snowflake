
define (require, exports) ->

  size = require './size'
  bend = require './bend'

  renderer = PIXI.autoDetectRenderer size.w, size.h
  stage = new PIXI.Stage 0xFFFFFF, true

  $('#paper').append renderer.view

  thing = new PIXI.Graphics()
  stage.addChild thing

  local = {}
  local.points = []
  local.caches = []

  animate = ->
    thing.clear()
    thing.lineStyle 1, 0x4444aa, 1

    first = local.caches[0]
    if first?
      thing.moveTo first.x, first.y
    local.caches[1..].forEach (point) ->
      thing.lineTo point.x, point.y

    renderer.render stage
    requestAnimationFrame animate

  animate()

  exports.set_points = (points) ->
    local.points = points
    tmp = points.concat()
    [1..5].forEach ->
      tmp = bend tmp, points
    local.caches = tmp

  exports