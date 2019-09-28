const window = {}
let lastTime = 0

window.setTimeout = global.setTimeout
window.clearTimeout = global.clearTimeout

window.requestAnimationFrame = function (fn, element) {
  const currTime = new Date().getTime()
  const timeToCall = Math.max(0, 16 - (currTime - lastTime))
  const id = window.setTimeout(function () {
    fn(currTime + timeToCall)
  }, timeToCall)
  lastTime = currTime + timeToCall
  return id
}

window.cancelAnimationFrame = function (id) {
  clearTimeout(id)
}

global.requestAnimationFrame = window.requestAnimationFrame
global.cancelAnimationFrame = window.cancelAnimationFrame
global.window = window
