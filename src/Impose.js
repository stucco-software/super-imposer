import { bookPageOrder } from './bookPageOrder.js'

export const imposePDF = ({data, signatures, imposeX = 2, imposeY = 1}) => {
  let pdf = coherentpdf.fromMemory(data, "")
  const length = coherentpdf.pages(pdf)
  const pages = coherentpdf.all(pdf)
  const result = bookPageOrder(length, imposeX, imposeY, signatures)
  const pageOrder = result.order.map(n => n+1)
  const orderedPDF = coherentpdf.mergeSame([pdf], false, false, [pageOrder])
  coherentpdf.impose(orderedPDF, imposeX, imposeY, false, false, false, false, false, 100, 0, 0)
  const out = coherentpdf.toMemory(orderedPDF, false, false)
  coherentpdf.deletePdf(pdf)
  coherentpdf.deletePdf(orderedPDF)
  return out
}

