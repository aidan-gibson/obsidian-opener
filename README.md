
obsidian-opener:
* opens md in new tabs (unless tab already exists, then switches to that tab).
* opens pdfs ([or other filetypes obsidian can open](https://help.obsidian.md/Advanced+topics/Accepted+file+formats)) with default app instead.




Lots of partial implementations of this exist (ie, QuickSwitcher++ can open new tabs by default&switch to existing tab if it exists...but it does nothing for clicking on an internal link within a note). This is a comprehensive solution that works by modifying Obsidian's built-in `openFile()` function (which is the function QuickSwitcher++ and Obsidian QuickSwitcher use under the hood.) So this should be compatible with all existing plugins out of the box, no matter how you're opening new files (from search results, Omnisearch, backlinks, etc). 
 

# Installation
## Recommended
1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) conventionally.
2. Use BRAT to install via this link https://github.com/aidan-gibson/obsidian-opener
3. Enable the plugin in settings.

I recommend enabling "Auto-Update Plugins at Startup" in BRAT settings. Obsidian may release breaking changes to this plugin at any time, staying up to date is very important. I actually install all my plugins via BRAT for ease of auto-update anyway, manually updating in Obsidian is a drag. 

## Source
Build from source via:
```sh
cd {your vault}/.obsidian/plugins
git clone https://github.com/aidan-gibson/obsidian-opener
npm install
npm run build
```
if it's already open, don't open it in new tab.
but if it's in canvas & selected it THINKS its open.
  fixed it partially; if note already open in another tab it'll now switch to it proper but open a new tab. 
  also if there's an empty tab available it won't pick it.
# ToDo:
- [ ] automated testing
- [ ] test mobile
- [ ] add basic gif to readme showing what plugin does
  - if works, update manifest.json 'isDesktopOnly'
- [ ] add to community plugins (iff automated testing & all issues done)
- [ ] beautify the settings page


# Notes
* Graph view command doesn't open in new tab, it doesn't use `openFile()`. I have provided command 'Open Graph View in new tab' you can reassign Ctrl/Cmd + G to.
* If there is a tab open in another Obsidian window which is minimized, it will look like nothing is happening. I don't have the ability to unminimize the other window as an Obsidian plug-in (afaik).
