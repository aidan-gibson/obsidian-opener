
obsidian-opener:
* opens md in new tabs (unless tab already exists, then switches to that tab).
* opens pdfs ([or other filetypes obsidian can open](https://help.obsidian.md/Advanced+topics/Accepted+file+formats)) with default app instead.




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
- [ ] test mobile
  - if works, update manifest.json 'isDesktopOnly'
- [ ] add to community plugins
- [ ] beautify the settings page
- [ ] html viewer plugin cooperation test
- [ ] graph view doesn't open in new tab
- when clicking [[sample.pptx]], power point opened in focus, but a new tab opened in obsid
# Notes
If there is a tab open in another Obsidian window which is minimized, it will look like nothing is happening. I don't have the ability to unminimize the other window as an Obsidian plug-in (afaik).
