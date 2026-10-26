import { useCallback, useEffect, useRef } from 'react'

// Les Pointer Events n'existent pas sur iOS 12 : on suit le doigt (touch),
// ou la souris pour tester sur ordinateur, jusqu'au relâchement.
function track(e, onMove, onEnd) {
  const listeners = []
  const listen = (type, handler) => {
    window.addEventListener(type, handler)
    listeners.push([type, handler])
  }

  if (e.type === 'touchstart') {
    const id = e.changedTouches[0].identifier
    const find = (ev) =>
      Array.prototype.find.call(ev.changedTouches, (t) => t.identifier === id)
    listen('touchmove', (ev) => {
      const touch = find(ev)
      if (touch) onMove(touch.clientX, touch.clientY)
    })
    const end = (ev) => {
      if (find(ev)) onEnd(ev.type === 'touchend')
    }
    listen('touchend', end)
    listen('touchcancel', end)
  } else {
    listen('mousemove', (ev) => onMove(ev.clientX, ev.clientY))
    listen('mouseup', () => onEnd(true))
  }

  return () => listeners.forEach(([type, handler]) => window.removeEventListener(type, handler))
}

// Renvoie start(e, options) à brancher sur onTouchStart et onMouseDown.
// Un seul appui est suivi à la fois ; start renvoie false s'il est ignoré.
//   longPressMs / onLongPress : déclenché si l'appui dure assez longtemps
//   onMove(x, y)              : déplacement pendant l'appui
//   onRelease({ completed, long }) : completed = false si le système annule le toucher
export function usePress() {
  const active = useRef(null)

  useEffect(() => () => active.current?.(), [])

  return useCallback((e, { longPressMs = 0, onLongPress, onMove, onRelease }) => {
    if (active.current) return false
    if (e.type === 'mousedown') {
      if (e.button !== 0) return false
      e.preventDefault()
    }

    let long = false
    const timer = longPressMs
      ? setTimeout(() => {
          long = true
          onLongPress()
        }, longPressMs)
      : null

    const stop = track(
      e,
      (x, y) => onMove?.(x, y),
      (completed) => {
        finish()
        onRelease?.({ completed, long })
      },
    )

    function finish() {
      clearTimeout(timer)
      stop()
      active.current = null
    }

    active.current = finish
    return true
  }, [])
}
