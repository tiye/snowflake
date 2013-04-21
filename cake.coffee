
{spawn, exec} = require "child_process"
fs = require "fs"

echo = (child) ->
  child.stderr.pipe process.stderr
  child.stdout.pipe process.stdout

split = (str) -> str.split " "

queue = [
  "jade -O ./ -wP layout/index.jade"
  "stylus -o show -w layout/"
  "doodle show"
]

command = "cjsify -o build.js action/main.coffee --source-map-file show/build.map"
build = ->
  exec command, (err, stdout, stderr) ->
    console.log err if err
    console.log 'compiled'

stamp = 0
cache = 0

do watch_loop = ->
  unless cache is stamp
    cache = stamp
    build()
  setTimeout watch_loop, 300

queue.map(split).forEach (array) ->
  echo (spawn array[0], array[1..])

list = fs.readdirSync "action/"
for name in list
  if name.match /\S+\.coffee$/
    fs.watch "action/#{name}", interval: 200, ->
      stamp += 1

build()