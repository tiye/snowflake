
events = require "events"
exports.chan = chan = new events.EventEmitter

random = (n = 600) -> Math.random() * n

dom = require("./dom.coffee")
area = dom.find("#cover")

class Point extends events.EventEmitter
  constructor: (@id) ->
    @elem = dom.new()
    @elem.onmousedown = @mouse_down
    @elem.onmouseup = @mouse_up
    @elem.onmousemove = @mouse_move
    @dragging = no
    @attrs = {}

    # todo dragging state

  mouse_down: ->
    @dragging = yes
    console.log "mouse down"

  mouse_up: ->
    @dragging = yes
    console.log "mouse up"

  set: (key, value) -> @[key] = value
  get: (key) -> @[key]

  mouse_move: (event) ->
    vertexes

vertexes =
  data: []
  more: ->
    id = @data.length
    point = new Point id
    @data.push point
    @notify()

  less: ->
    @data.pop()
    @notify()

  notify: ->
    data = []
    @data.forEach (point) =>
      data.push
        x: point.get "x"
        y: point.get "y"
    @emit "update", data