const main = async () => {
  console.log('logo looker')
}

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

window.addEventListener("DOMContentLoaded", () => {
  main()
  const window_width = 250
  let shifty_eyes = false

  const eyePixels = [...document.querySelectorAll('.pupil')]

  window.addEventListener("mousemove", (event) => {
    if (event.x < (window_width / 2)) {
      if (!shifty_eyes) {
        console.log('look left')
        lookLeft(eyePixels)
        shifty_eyes = true
      }
    } else {
      if (shifty_eyes) {
        console.log('look right')
        lookRight(eyePixels)
        shifty_eyes = false
      }
    }
  })
})
