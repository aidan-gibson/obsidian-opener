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
		// this.migrateSettings();
		this.addSettingTab(new OpenerSettingTab(this.app, this));
		this.monkeyPatchopenFile();
		// this.monkeyPatchopenLinkText();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		// (this.app as any).commands.removeCommand(
		// 	`editor:open-link-in-new-leaf`
		// );
		// (this.app as any).commands.addCommand(`editor:open-link-in-new-leaf`);
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
					console.log(openState);
					if (parentThis.settings.PDFApp && file.extension == 'pdf') {
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

	// fixes editor:open-link-in-new-leaf, context menu > open in new tab, etc, command palette "open link under cursor in new tab"
	// monkeyPatchopenLinkText() {
	// 	let parentThis = this;
	// 	this.uninstallMonkeyPatch = around(Workspace.prototype, {
	// 		openLinkText(oldOpenLinkText) {
	// 			return async function (
	// 				linkText: string,
	// 				sourcePath: string,
	// 				newLeaf?: PaneType | boolean,
	// 				openViewState?: OpenViewState
	// 			) {
	// 				//app.workspace.detachLeavesOfType('empty');
	// 				console.log(newLeaf);
	// 				// PaneType: 'split' if to the right, true if new tab. this thing isn't catching window, openFile is.
	// 				if (parentThis.settings.newTab) {
	// 					if (newLeaf == "split") {
	// 						// this.app.workspace.getLeaf("split");
	// 						// // this.app.workspace.setActiveLeaf(
	// 						// // 	this.app.workspace.getRightLeaf(true)
	// 						// // );
	// 						// // WorkspaceLeaf.prototype.openFile()
	// 						// this.app.workspace
	// 						// 	.getRightLeaf(true)
	// 						// 	.prototype.openFile("");
	// 						// return;
	// 						// 	instead of this path, I should just mod other monkeypath to use existing empty leaves, if they exist
	// 					} else if (newLeaf == true) {
	// 						// newLeaf = false;
	// 					}
	// 				}
	// 				oldOpenLinkText &&
	// 					oldOpenLinkText.apply(this, [
	// 						linkText,
	// 						sourcePath,
	// 						newLeaf,
	// 						openViewState,
	// 					]);
	// 			};
	// 		},
	// 	});
	// }
}
