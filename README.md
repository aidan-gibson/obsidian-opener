
obsidian-opener:
* opens pdfs with default app
* opens md in new tabs (unless tab already exists, then switches to that tab)



Lots of partial implementations of this exist (ie, QuickSwitcher++ can open new tabs by default&switch to existing tab if it exists...but it does nothing for clicking on an internal link within a note). This is a comprehensive solution that works by modifying Obsidian's built-in `openFile()` function (which is the function QuickSwitcher++ and Obsidian QuickSwitcher use under the hood.) So this should be compatible with all existing plugins out of the box, no matter how you're opening new files (from search results, Omnisearch, backlinks, etc). 
 

# Install
## Recommended
1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) conventionally.
2. Use BRAT to install via this link https://github.com/aidan-gibson/obsidian-opener

## Source
Build from source via:
```sh
cd {your vault}/.obsidian/plugins
git clone https://github.com/aidan-gibson/obsidian-opener
npm install
npm run build
```

# ToDo:
- [ ] move ts files into src
- [ ] header (and presumably block links etc) don't take u to correct place if coming from another page
- [ ] open link under cursor [to the right / in new window] (broken), 
- create note to the right
- [ ] test mobile
  - if works, update manifest.json 'isDesktopOnly'
- [ ] test with common plugins etc
- [ ] add to community plugins
- [ ] html viewer plugin
opening graph view ruins

- if middle click or right click > open in new tab or QuickSwitcher++ cmd+enter, a new empty tab is opened
- what if someone wants to open an existing tab in new window? current implementation won't let them. add option to treat windows as siloed (only look for existing tabs in current window), so ya can open a tab that exists in another window in a new window

# Notes
If there is a tab open in another Obsidian window which is minimized, it will look like nothing is happening. I don't have the ability to unminimize the other window as an Obsidian plug-in (afaik).

# Notes on Other Plugins
* QuickSwitcher++
  * Turn off "Default to open in new tab"; else you will get extra empty tabs
