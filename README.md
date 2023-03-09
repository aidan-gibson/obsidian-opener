
obsidian-opener:
* opens pdfs with default app
* opens md in new tabs (unless tab already exists, then switches to that tab)



Lots of partial implementations of this exist (ie, QuickSwitcher++ can open new tabs by default&switch to existing tab if it exists...but it does nothing for clicking on an internal link within a note, etc). This is a comprehensive solution that works by modifying Obsidian's built-in `openFile()` function (which is the function QuickSwitcher++ and Obsidian QuickSwitcher use, etc etc. So this should be compatible with all existing plugins out of the box, no matter how you're opening new files (from search results, Omnisearch, backlinks, etc etc).) 



todo: 

settings (toggle openpdfwdefaultapp on/off)
mobile?
add to community plugins
