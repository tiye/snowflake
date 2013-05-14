
require "./extend"

global.debug =
  raw_mouse: no
  wrapped_mouse: yes

width = 1000
height = 600

dom = require("./dom")

window.onload = ->

  dom.q("#paper").setAttribute "width", width
  dom.q("#paper").setAttribute "height", height
  dom.q("#cover").style.width = "#{width}px"
  dom.q("#cover").style.height = "#{height}px"

  drag = require("./drag").chan
  drag.emit "init"
  console.log "start"

  render = require("./render").chan
  # render.test()

  drag.on "update", (list) ->
    render.emit "render", list

  dom.q("#more").onclick = -> drag.emit "more"
  dom.q("#less").onclick = -> drag.emit "less"
  dom.q("#greater").onclick = ->
    render.emit "greater"
    drag.emit "trigger"
  dom.q("#smaller").onclick = ->
    render.emit "smaller"
    drag.emit "trigger"

  render.emit "color", "hsla(40,60%,60%,0.6)"
  drag.emit "trigger"