import { bookPageOrder } from '/lib/bookPageOrder.js'

export const imposePDF = async ({data, signatures, imposeX = 2, imposeY = 1}) => {
  let pdf = coherentpdf.fromMemory(data, "")
  const length = coherentpdf.pages(pdf)
  const pages = coherentpdf.all(pdf)
  const result = bookPageOrder(length, imposeX, imposeY, signatures)
  console.log(result)
  const pageOrder = result.order.map(n => n+1)
  console.log(pageOrder)
  const orderedPDF = coherentpdf.mergeSame([pdf], false, false, [pageOrder])
  console.log(orderedPDF)
  try {
    console.log('try this!')
    coherentpdf.impose(orderedPDF, imposeX, imposeY, false, false, false, false, false, 100, 0, 0)
  } catch (e) {
    coherentpdf.deletePdf(pdf)
    coherentpdf.deletePdf(orderedPDF)
    window.alert('An error occured when imposing this PDF. Try re-exporting the PDF and restarting the app.')
    console.error(e)
  }
  const out = coherentpdf.toMemory(orderedPDF, false, false)
  console.log('did it work?')
  console.log(out)
  coherentpdf.deletePdf(pdf)
  coherentpdf.deletePdf(orderedPDF)
  return out
}

