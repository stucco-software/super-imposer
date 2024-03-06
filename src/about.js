let shifty_eyes = false

const lookLeft = (arr) => {
  arr.forEach(px => {
    px.classList.add('shifty')
  })
}

const lookRight = (arr) => {
  arr.forEach(px => {
    px.classList.remove('shifty')
  })
}

const watchMouse = (window_width, eye_pixels) => (event) => {
  if (event.x < (window_width / 2)) {
    if (!shifty_eyes) {
      lookLeft(eye_pixels)
      shifty_eyes = true
    }
  } else {
    if (shifty_eyes) {
      lookRight(eye_pixels)
      shifty_eyes = false
    }
  }
}

const main = async () => {
  const window_width = 250
  const eye_pixels = [...document.querySelectorAll('.pupil')]
  window.addEventListener("mousemove", watchMouse(window_width, eye_pixels))
}

window.addEventListener("DOMContentLoaded", () => {
  main()
})
