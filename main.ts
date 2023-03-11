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
	PaneType,
} from 'obsidian';
import { around } from 'monkey-around';
import { OpenerSettingTab } from './settings';
import { DEFAULT_SETTINGS } from './constants';
import { OpenerSetting } from './types';

export default class Opener extends Plugin {
	settings: OpenerSetting;
	uninstallMonkeyPatch: () => void;

	async onload() {
		console.log('loading ' + this.manifest.name + ' plugin');
		await this.loadSettings();

		this.addSettingTab(new OpenerSettingTab(this.app, this));
		this.monkeyPatchopenFile();
		this.monkeyPatchopenLinkText();
	}

	onunload(): void {
		this.uninstallMonkeyPatch && this.uninstallMonkeyPatch();
		console.log('unloading ' + this.manifest.name + ' plugin');
	}

	async loadSettings() {
		// At first startup, `data` is `null` because data.json does not exist.
		const data = (await this.loadData()) as OpenerSetting | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	monkeyPatchopenFile() {
		// TODO
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const parentThis = this;
		this.uninstallMonkeyPatch = around(WorkspaceLeaf.prototype, {
			openFile(oldopenFile) {
				return async function (file: TFile, openState?: OpenViewState) {
					const ALLEXT = ['png', 'webp', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'mp3', 'webm', 'wav', 'm4a', 'ogg','3gp', 'flac', 'mp4', 'ogv', 'mov', 'mkv'];
					if ((parentThis.settings.PDFApp && file.extension == 'pdf') || (parentThis.settings.allExt && ALLEXT.includes(file.extension)) || (parentThis.settings.custExt && parentThis.settings.custExtList.includes(file.extension))) {
						// @ts-ignore
						app.openWithDefaultApp(file.path);
						return;
					}

					// if clicking on link with same path as active file in view, defer to default behavior (ie headings, blocks, etc). file.path is thing being opened. app.workspace.getActiveFile()?.path is currently opened tab filepath.
					let openElsewhere = false;
					const sameFile = file.path == app.workspace.getActiveFile()?.path;

					if (sameFile) {
						oldopenFile && oldopenFile.apply(this, [file, openState]);
						return;
					}

					else if (parentThis.settings.newTab && !sameFile) {

						// else if already open in another tab, switch to that tab
						app.workspace.iterateAllLeaves((leaf: WorkspaceLeaf) => {
							if (leaf.getViewState().state?.file == file.name) {
								oldopenFile && oldopenFile.apply(leaf, [file, openState]);
								openElsewhere = true;
								return;
							}
						});

						// else open in new tab


						if (!openElsewhere && parentThis.settings.newTab && !sameFile) {

							// if there's already an empty leaf, pick that one

							const emptyLeaves = app.workspace.getLeavesOfType('empty');
							if (emptyLeaves.length > 0) {
								oldopenFile &&
								oldopenFile.apply(emptyLeaves[0], [file, openState]);
								return;
							}
							else if (emptyLeaves.length <= 0) {
								oldopenFile &&
									oldopenFile.apply(this.app.workspace.getLeaf('tab'), [
										file,
										openState,
									]);
								return;
							}
						}
					}

					// default behavior
					else if (!parentThis.settings.newTab) {
						oldopenFile && oldopenFile.apply(this, [file, openState]);
						return;
					}
				};
			},
		});
	}

	// if note already exists, monkeyPatchopenFile() does its job and moves to that one. but openLinkText() with options selected for new tab (invoked via Right Click > Open in New Tab or Quick Switcher Cmd+Enter, etc) will still open a new tab.
	monkeyPatchopenLinkText() {
		let parentThis = this;
		this.uninstallMonkeyPatch = around(Workspace.prototype, {
			openLinkText(oldOpenLinkText) {
				return async function (
					linkText: string,
					sourcePath: string,
					newLeaf?: PaneType | boolean,
					openViewState?: OpenViewState
				) {
					console.log(newLeaf);
					console.log(openViewState);
					if(newLeaf == 'tab'){
						newLeaf = false;
					}
					oldOpenLinkText &&
						oldOpenLinkText.apply(this, [
							linkText,
							sourcePath,
							newLeaf,
							openViewState,
						]);
				};
			},
		});
	}

}
