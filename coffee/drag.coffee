
events = require "events"
exports.chan = chan = new events.EventEmitter

{g} = require "log-group"
g.set "mouse", off
g.set "move", off
g.set "watch x", off
g.set "points", off

random = (n = 600) -> Math.random() * n

elem_radius = 8

dom = require("./dom.coffee")

paper = dom.info "#cover"

class Point extends events.EventEmitter
  constructor: (@id) ->
    @elem = dom.make_point @id
    @dragging = no
    @attrs = {}
    @listen_mouse()

    @random_position()
    @emit "update"

    # todo dragging state
  listen_mouse: =>
    mouse = dom.global_mouse()
    mouse.on "down", (event) =>
      if event.target.id is @elem.id
        @mouse_down event

    mouse.on "up", (event) =>
      if @dragging then @mouse_up()

    mouse.on "move", (event) =>
      if @dragging then @mouse_move event

    @elem.onmousedown = (event) =>
      g "mouse", "mouse down", event
      @set "on_x", event.layerX
      @set "on_y", event.layerY

  mouse_down: (event) =>
    @dragging = yes
    g "mouse", "mouse down", event

    @set "start_x", event.layerX
    @set "start_y", event.layerY
    dom.chan.emit "pointer", @elem

  mouse_up: =>
    @dragging = no
    g "mouse", "mouse up"
    dom.chan.emit "normal"

  mouse_move: (event) =>
    if @dragging
      g "mouse", "dragging", event
      now_x = event.layerX
      now_y = event.layerY
      pos_x = now_x - (@get "start_x") - (@get "on_x")
      pos_y = now_y - (@get "start_y") - (@get "on_y")
      g "move", pos_x, pos_y
      if (pos_x > 10) and (pos_y > 10)
        @set "x", (pos_x + elem_radius)
        @set "y", (pos_y + elem_radius)
        @elem.style.left = "#{@get "x"}px"
        @elem.style.top = "#{@get "y"}px"
        @emit "update"

  set: (key, value) => @[key] = value
  get: (key) => @[key]

  random_position: =>
    x = random paper.width
    y = random paper.height
    @set "x", (x + elem_radius)
    @set "y", (y + elem_radius)
    @elem.style.left = "#{@get "x"}px"
    @elem.style.top = "#{@get "y"}px"

  remove: ->
    dom.remove @elem

vertexes =
  data: []
  more: ->
    console.log "more"
    id = @data.length
    point = new Point id
    @data.push point
    @notify()

    point.on "update", => @notify()

  less: ->
    point = @data.pop()
    point.remove()
    @notify()

  notify: ->
    data = []
    @data.forEach (point) =>
      data.push
        x: (point.get "x") + elem_radius
        y: (point.get "y") + elem_radius

    g "points", data
    exports.chan.emit "update", data

chan.on "init", ->
  console.log "init"
  [1..4].map -> vertexes.more()

chan.on "more", -> vertexes.more()

chan.on "less", -> vertexes.less()

chan.on "trigger", -> vertexes.notify()