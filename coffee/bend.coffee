
define ->

  check = (points...) ->
    points.forEach (point) ->
      unless (point.x < Infinity) then throw new Error "x"
      unless (point.y < Infinity) then throw new Error "y"

  add = (a, b) ->
    # check a, b
    x: a.x + b.x
    y: a.y + b.y

  minus = (a, b) ->
    # check a, b
    x: a.x - b. x
    y: a.y - b. y

  multiply = (a, b) ->
    # check a, b
    x: (a.x * b.x) - (a.y * b.y)
    y: (a.x * b.y) + (a.y * b.x)

  conjugate = (a) ->
    # check a
    x: a.x
    y: - a.y

  divide = (a, b) ->
    # check a, b
    numberator = multiply a, (conjugate b)
    denominator = multiply b, (conjugate b)
    if (denominator.x is 0) and (denominator.y is 0)
      x: 0, y: 0
    else
      x: numberator.x / denominator.x
      y: numberator.y / denominator.x

  square = (a) -> Math.pow a, 2
  distance = (a, b) -> square(a.x - b.x) + square(a.y - b.y)

  each_grow = (origin, destination, path) ->
    # console.log "given", origin, destination, path
    start = path[0]
    end = path[path.length - 1]
    course = minus end, start
    whole_course = minus destination, origin

    factor = divide whole_course, course

    result = []

    path[1...-1].forEach (a) ->
      b = minus a, start
      c = multiply b, factor
      result.push (add origin, c)

    result.push destination
    result

  (list, template) ->
    base_point = list[0]
    result = [base_point]

    list[1..].forEach (guide_point) ->
      if 1 < (distance guide_point, base_point) < 800000
        segment = each_grow base_point, guide_point, template
        result.push segment...
        base_point = guide_point

    result