
{spawn, exec} = require "child_process"

echo = (child) ->
  child.stderr.pipe process.stderr
  child.stdout.pipe process.stdout

split = (str) -> str.split " "

queue = [
  "jade --out ./ -wP src/index.jade"
  "stylus -o build -w src/"
  "cjsify -o build.js -w coffee/main.coffee --source-map-file build/build.map"
  "doodle build build.js"
]

task "dev", "develop mode", ->
  queue.map(split).forEach (array) ->
    echo (spawn array[0], array[1..])