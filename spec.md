# Spec

- [x] Open app
  - [x] New Project screen
    - [x] Select PDF
      - [x] Show number of pages in pdf
      - [x] Select number of booklets
        - [x] Show number of pages per booklet
      - [x] Set Layout
        - [x] `x` pages across
        - [x] `y` pages down
      - [x] Show Preview
      - [x] Other options TK
      - [x] Save project
        - [x] Write config to json
      - [x] Output PDF
  - [x] Open Project
    - [x] Select config file
      - [ ] Check for correct `@context`
      - [ ] ~~Check for input file~~
        - [ ] Surface errors
  - [x] Show Info
    - [x] Show logo
      - [x] Eyes follow cursor/focus
    - [x] Show name, version, source, url, etc
  - [x] Show Preferences
    - [x] Choose default values

## Concerns;

Tauri is not able to access or save the real filepath to the input file, instead masking it as `C://fakepath/filename.pdf`. This is for security reasons I guess, so we can't expose system data to the application. Fine. Then tho, the question becomes how does this impace the `save project` workflow?

We _could_ save the filename and the pdf data (as binary) to our save file. Then we open the saved project, we load and preview the _Saved PDF_. But the issue here is twofold:

1. The saved PDF could be _quite large_ as a binary array.
2. The user would only _see_ the path of the _original file_ they selected, making it inclear which pdf is being imposed.

The concern here is we generate PDF_1, and impose it for print. We then go _back_ to the source files, and make some edits. We save that at the same path as PDF_1, replaceing it with PDF_2. When we reopen our Super Imposer project, we see that that path is loaded to PDF_1. But when we impose and export, we are just-reimposing and re-exporting PDF_1, even tho it _looks like_ we should be imposing PDF_2.

I guess the solution here is to _not_ try and persist the input pdf across project saves, intead just saving the project settings and requiring the user to re-select the import file. Is that useful? I kinda wish Stochaster could save settings, so I could go back to it. As we get more and more options, maybe it makes sense.

