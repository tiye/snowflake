
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
  local.level = 6

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
    update_cache()

  update_cache = ->
    tmp = local.points.concat()
    [1..local.level].forEach ->
      tmp = bend tmp, local.points
    local.caches = tmp

  $('#more').click ->
    local.level += 1
    update_cache()
  $('#less').click ->
    if local.level > 2
      local.level -= 1
      update_cache()

  exports