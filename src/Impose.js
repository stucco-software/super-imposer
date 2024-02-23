import { bookPageOrder } from './bookPageOrder.js'

export const imposePDF = ({data}) => {
  let pdf = coherentpdf.fromMemory(data, "")
  const length = coherentpdf.pages(pdf)
  const pages = coherentpdf.all(pdf)
  const result = bookPageOrder(length, 2, 1, 8)
  const pageOrder = result.order.map(n => n+1)
  const orderedPDF = coherentpdf.mergeSame([pdf], false, false, [pageOrder])
  coherentpdf.impose(orderedPDF, 2, 1, false, false, false, false, false, 100, 0, 0)
  const out = coherentpdf.toMemory(orderedPDF, false, false)
  coherentpdf.deletePdf(pdf)
  coherentpdf.deletePdf(orderedPDF)
  return out
}

