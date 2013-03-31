
data = {}

exports.on = (name, callback) ->
  unless data[name]? then data[name] = []
  unless callback in data[name]
    data[name].push callback

exports.trigger = (name, args...) ->
  if data[name]?
    data[name].forEach (callback) ->
      callback args...

exports.remove = (name, callback) ->
  if data[name]?
    if callback?
      side = []
      data[name].forEach (the_one) ->
        side.push the_one unless callback is the_one
      if side.length > 0 then data[name] = side
      else delete data[name]
    else delete data[name]

exports.test = ->
  exports.on "test", -> console.log "a test"
  exports.trigger "test"
  exports.remove "test"
  exports.trigger "test"