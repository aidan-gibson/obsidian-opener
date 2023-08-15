import {
	Plugin,
	App,
	OpenViewState,
	Workspace,
	WorkspaceLeaf,
	MarkdownView,
	Notice,
	TFile,
	PluginSettingTab,
	Setting,
	PaneType, Editor
} from 'obsidian';
import { around } from 'monkey-around';
import { OpenerSettingTab } from './settings';
import { DEFAULT_SETTINGS } from './constants';
import { OpenerSetting } from './types';

export default class Opener extends Plugin {
	settings: OpenerSetting;
	isMetaKeyHeld: boolean | null = null;
	sameTabOnce: boolean = false;
	uninstallMonkeyPatchOpenFile: () => void;

	async onload() {
		console.log('loading ' + this.manifest.name + ' plugin');
		await this.loadSettings();

		this.addSettingTab(new OpenerSettingTab(this.app, this));
		this.updateMetaKeyListeners();
		this.monkeyPatchOpenFile();
		this.addCommands();
		this.addMenuItem();
	}

	onunload(): void {
		this.uninstallMonkeyPatchOpenFile && this.uninstallMonkeyPatchOpenFile();
		this.removeMetaKeyListeners();
		console.log('unloading ' + this.manifest.name + ' plugin');
	}

	async loadSettings() {
		// At first startup, `data` is `null` because data.json does not exist.
		const data = (await this.loadData()) as OpenerSetting | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.updateMetaKeyListeners();
	}


	addCommands() {
		this.addCommand({
			id: "same-tab-once",
			name: "Open next file in same tab (Obsidian default behavior)",
			checkCallback: (checking: boolean) => {
				if (checking) {
					return this.settings.newTab;
				}
				this.sameTabOnce = true;
				new Notice("Next file will open in same tab");
			}
		});

		this.addCommand({
			id: "enable-new-tab",
			name: "Enable new tab for all files",
			checkCallback: (checking: boolean) => {
				if (checking) {
					return !this.settings.newTab;
				}
				this.settings.newTab = true;
				this.saveSettings();
				new Notice("Opener: New tab for all files enabled");
			},
		});
		this.addCommand({
			id: "disable-new-tab",
			name: "Disable new tab for all files",
			checkCallback: (checking: boolean) => {
				if (checking) {
					return this.settings.newTab;
				}
				this.settings.newTab = false;
				this.saveSettings();
				new Notice("Opener: New tab for all files disabled");
			}
		});

		this.addCommand({
			id: "enable-pdf",
			name: "Enable open all PDFs with default app",
			checkCallback: (checking: boolean) => {
				if (checking) {
					return !this.settings.PDFApp;
				}
				this.settings.PDFApp = true;
				this.saveSettings();
				new Notice("Opener: Open all PDFs with default app enabled");
			}
		});
		this.addCommand({
			id: "disable-pdf",
			name: "Disable open all PDFs with default app",
			checkCallback: (checking: boolean) => {
				if (checking) {
					return this.settings.PDFApp;
				}
				this.settings.PDFApp = false;
				this.saveSettings();
				new Notice("Opener: Open all PDFs with default app disabled");
			}
		});

		this.addCommand({
			id: "open-graph-view-in-new-tab",
			name: "Open Graph View in new tab",
			callback: () => {
				// @ts-ignore
				this.app.commands.executeCommandById("workspace:new-tab");
				// @ts-ignore
				this.app.commands.executeCommandById("graph:open");
			},
		});
	}

	// add command to right-click menu
	addMenuItem() {
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file, source, leaf) => {
				if (file instanceof TFile) {
					menu.addItem((item) => {
						item.setSection("open");
						item.setTitle("Open in same tab")
							.onClick(() => {
								this.sameTabOnce = true;
								this.app.workspace.getLeaf().openFile(file);
							});
					});
				}
			})
		);
	}



	// Meta key listeners
	// arrow syntax to preserve `this` context
	keyDownHandler = (e: KeyboardEvent) => {
		if (e.key === 'Meta' || e.key === 'Control') {
			this.isMetaKeyHeld = true;
		}
	}
	keyUpHandler = (e: KeyboardEvent) => {
		if (e.key === 'Meta' || e.key === 'Control') {
			this.isMetaKeyHeld = false;
		}
	}
	// Mouse handler is needed because the key handler will not fire if the app is out of focus
	mouseDownHandler = (e: MouseEvent) => {
		if (e.metaKey || e.ctrlKey) {
			this.isMetaKeyHeld = true;
		} else {
			this.isMetaKeyHeld = false;
		}
	}
	addMetaKeyListeners() {
		if (this.isMetaKeyHeld !== null) return; // already added
		this.isMetaKeyHeld = false;
		document.addEventListener('keydown', this.keyDownHandler);
		document.addEventListener('keyup', this.keyUpHandler);
		document.addEventListener('mousedown', this.mouseDownHandler, { capture: true });
	}
	removeMetaKeyListeners() {
		if (this.isMetaKeyHeld === null) return; // nothing to remove
		document.removeEventListener('keydown', this.keyDownHandler);
		document.removeEventListener('keyup', this.keyUpHandler);
		document.removeEventListener('mousedown', this.mouseDownHandler, { capture: true });
		this.isMetaKeyHeld = null;
	}

	updateMetaKeyListeners() {
		if (this.settings.extOnlyWhenMetaKey) {
			this.addMetaKeyListeners();
		} else {
			this.removeMetaKeyListeners();
		}
	}

	monkeyPatchOpenFile() {
		const parentThis = this;
		this.uninstallMonkeyPatchOpenFile = around(WorkspaceLeaf.prototype, {
			openFile(oldOpenFile) {
				return async function (file: TFile, openState?: OpenViewState) {
					const ALLEXT = ['png', 'webp', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'mp3', 'webm', 'wav', 'm4a', 'ogg', '3gp', 'flac', 'mp4', 'ogv', 'mov', 'mkv'];
					const OBSID_OPENABLE = ALLEXT.concat(['md', 'canvas', 'pdf']);

					const defaultBehavior = () => {
						return oldOpenFile.apply(this, [file, openState]);
					}

					if (
						((parentThis.settings.PDFApp && file.extension == 'pdf')
							|| (parentThis.settings.allExt && ALLEXT.includes(file.extension))
							|| (parentThis.settings.custExt && parentThis.settings.custExtList.includes(file.extension))
							|| (!OBSID_OPENABLE.includes(file.extension) && (!parentThis.settings.custExtIn || (parentThis.settings.custExtIn && !parentThis.settings.custExtInList.includes(file.extension))))
						)
						&& (!parentThis.settings.extOnlyWhenMetaKey || parentThis.isMetaKeyHeld)
					) {
						// @ts-ignore-next-line
						app.openWithDefaultApp(file.path);
						return;
					}

					// defer to default behavior if:
					// - clicking on link with same path as active file in view (ie headings, blocks, etc). file.path is thing being opened. app.workspace.getActiveFile()?.path is currently opened tab filepath.
					// - mode is preview (eg. hover editor, excalidraw, embeddings, etc) see issue #5
					// - tab is linked to another tab (group), see issue #9
					let openElsewhere = false;
					const sameFile = file.path == app.workspace.getActiveFile()?.path;
					const previewMode = !!openState?.state?.mode;
					if (sameFile || previewMode || this.group) {
						return defaultBehavior();
					}

					if (parentThis.sameTabOnce) {
						parentThis.sameTabOnce = false;
						return defaultBehavior();
					}

					else if (parentThis.settings.newTab && !sameFile) {
						// else if already open in another tab, switch to that tab
						app.workspace.iterateRootLeaves((leaf: WorkspaceLeaf) => {
							// if (leaf.getViewState().state?.file == file.name) {
							// leaf.getViewState().state?.file = 'Folder/folder note.md' (if it's within a folder). this will not match with file.name
							// console.log(file.path);
							// if (leaf.getViewState().state?.file?.endsWith(file.name)) { //this works. but also:
							if (leaf.getViewState().state?.file == (file.path) && leaf.getViewState().type != 'canvas') {
								oldOpenFile && oldOpenFile.apply(leaf, [file, openState]);
								openElsewhere = true;
								// close potentially prepared empty leaf (fixes #14 and #1)
								if (leaf !== this && this.getViewState()?.type == 'empty') {
									this.detach();
								}
							}
						});

						// else open in new tab
						if (!openElsewhere && parentThis.settings.newTab && !sameFile) {
							// if there's already an empty leaf, pick that one
							const emptyLeaves = app.workspace.getLeavesOfType('empty');
							if (emptyLeaves.length > 0) {
								oldOpenFile &&
									oldOpenFile.apply(emptyLeaves[0], [file, openState]);
								return;
							}
							else if (emptyLeaves.length <= 0) {
								// console.log("emptyLeaves.length <= 0");
								oldOpenFile &&
									oldOpenFile.apply(this.app.workspace.getLeaf('tab'), [
										file,
										openState,
									]);
								return;
							}
						}
					}

					// default behavior
					else if (!parentThis.settings.newTab) {
						return defaultBehavior();
					}
				};
			},
		});
	}

}
