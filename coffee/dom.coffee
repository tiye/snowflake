
exports.find = exports.q = q = (query) ->
  document.querySelector query

exports.drop = (name) ->
  div = document.createElement("div")
  div.setAttribute "class", "drag"
  div.innerText = name
  div

exports.new = (tag = "div") ->
  document.createElement tag

exports.make_point = (id) ->
  elem = document.createElement "div"
  elem.className = "drag"
  elem.id = "number" + id
  elem.innerText = id
  q("#cover").appendChild elem
  elem

exports.info = (query) ->
  elem = q(query)
  width = elem.offsetWidth
  height = elem.offsetHeight

  {width, height}

events = require "events"

exports.global_mouse = ->
  chan = new events.EventEmitter

  q("body").addEventListener "mousedown", (event) ->
    console.log "mousedown" if debug.raw_mouse
    chan.emit "down", event

  q("body").addEventListener "mouseup", (event) ->
    console.log "mousedown" if debug.raw_mouse
    chan.emit "up", event

  q("body").addEventListener "mousemove", (event) ->
    chan.emit "move", event

  q("body").addEventListener "mouseleave", (event) ->
    console.log "mouseleave" if debug.raw_mouse
    chan.emit "up", event

  chan

exports.remove = (elem) ->
  elem.parentElement.removeChild elem