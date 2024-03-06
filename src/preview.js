import { embedPDF } from '/lib/pdf.js'

const bc_preview = new BroadcastChannel("preview_channel")

bc_preview.onmessage = (event) => {
  const blob = new Blob([event.data], { type: 'application/pdf' });
  const src = URL.createObjectURL(blob)
  embedPDF(src)
}
