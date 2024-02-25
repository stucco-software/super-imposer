const bc_preview = new BroadcastChannel("preview_channel")

console.log('hellllo?')

bc_preview.onmessage = (event) => {
  console.log('got message!')
  const body = document.querySelector("body")
  const template = document.querySelector("#preview")
  const clone = template.content.cloneNode(true)
  const blob = new Blob([event.data], { type: 'application/pdf' });
  const src = URL.createObjectURL(blob)
  clone.querySelector("embed").setAttribute("src", src);
  body.appendChild(clone)
}
