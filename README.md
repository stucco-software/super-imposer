# Super Imposer 3000

Super Imposer is a small, simple application for imposing pdf documents for print. It's a graphical user infterface wrapper around a c++ imposition library.


## Tools

### BookPageOrder

> https://github.com/naknomum/BookPageOrder

### QPDF

> https://qpdf.readthedocs.io/en/stable/index.html

qpdf --split-pages=16 in.pdf out_%d.pdf
qpdf --empty --pages in.pdf 16,1,2,15,14,3,4,13,12,5,6,11,10,7,8,9 -- out.pdf

### CoherentPDF

> https://www.coherentpdf.com/
> https://www.npmjs.com/package/coherentpdf
> https://coherentpdf.com/cpdfjsmanual.pdf
> https://github.com/coherentgraphics/coherentpdf.js/blob/master/cpdflibtest.js
> https://www.coherentpdf.com/jscpdf/global.html

YES IT FUCKING WILL

```
import cpdf from 'coherentpdf'

let pdf = cpdf.fromFile("in.pdf", "")
var all = cpdf.all(pdf);
var arr = [pdf];

// Here is where we computer the booklet page order from source.
var ranges = [[16,1,2,15,14,3,4,13,12,5,6,11,10,7,8,9]]

const ordered = cpdf.mergeSame(arr, false, false, ranges);
cpdf.impose(ordered, 2, 1, false, false, false, false, false, 100, 0, 0)
cpdf.toFile(ordered, "out.pdf", false, false)

cpdf.deletePdf(pdf)
```


## Spec

## Schedule

- [x] Tauri demo app
- [x] Tauri demo app build check
  - builds to 6.5mb
- [ ] Test C++ lib for imposing
- [ ] Test calling C++ lib from Tauri
- [ ] Test upload of PDF to app
- [ ] Pass uploaded PDF to Tauri
- [ ] Set up configuration options
  - [ ] n-up
  - [ ] signature size
  - [ ] bleeds? what else can the lib do?
