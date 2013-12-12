
define (require, exports) ->

  local = {}

  size = require './size'

  cover = $ '#cover'

  make_point = ->
    elem = $ "<div class='point'>#{cover.children().length}</div>"
    pos = size.random_position()
    elem.css 'top', "#{pos.y}px"
    elem.css 'left', "#{pos.x}px"
    cover.append elem

    elem.on 'dragstart', (event) ->
      console.log elem, event

  make_point()
  make_point()

  get_positions = ->
    $.map $('#cover').children(), (child) ->
      x: parseInt $(child).css 'left'
      y: parseInt $(child).css 'top'

  $('#increase').click ->
    make_point()
    local.notify get_positions()

  $('#decrease').click ->
    cover.children().last().off().remove()
    local.notify get_positions()

  dragging = no
  cacheElem = null

  $('#cover').mousedown (event) ->
    if $(event.target).is('.point')
      dragging = yes
      cacheElem = $ event.target

  $('#cover').mouseup ->
    dragging = no
    cacheElem = null

  $('#cover').mousemove (event) ->
    if dragging
      cacheElem.css 'left', "#{event.x}px"
      cacheElem.css 'top', "#{event.y}px"
      local.notify get_positions()

  exports.listen = (handler) ->
    local.notify = handler

  exports.demo = ->
    local.notify get_positions()

  exports