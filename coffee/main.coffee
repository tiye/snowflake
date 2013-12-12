
define (require, exports) ->

  drag = require './drag'
  render = require './render'

  drag.listen (positions) ->
    render.set_points positions

  drag.demo()
