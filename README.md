
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
- [ ] settings (Toggle openpdf and open newtab on/off for ppl who just want one of the features).
- [ ] test mobile
- [ ] test with common plugins etc
- [ ] add to community plugins
- [ ] html viewer plugin

# Notes to Self
`git commit -am "commit msg" && git push` as per usual


`git tag 1.0.4` (and update manifest.json + package.json) (automate this)
`git push origin --tags` github releases won't drop new release unless this is done.

test using vault 123; main vault is linked to github releases via BRAT

also updating dependencies & obsid itself etc, also eslint yadda yadda.
