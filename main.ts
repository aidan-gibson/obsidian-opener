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
} from "obsidian";
import { around } from "monkey-around";
import { OpenerSettingTab } from "./settings";
import { DEFAULT_SETTINGS } from "./constants";
import { OpenerSetting } from "./types";

export default class Opener extends Plugin {
	settings: OpenerSetting;
	uninstallMonkeyPatch: () => void;

	async onload() {
		console.log("loading " + this.manifest.name + " plugin");
		await this.loadSettings();
		// this.migrateSettings();
		this.addSettingTab(new OpenerSettingTab(this.app, this));
		this.monkeyPatchopenFile();
	}

	onunload(): void {
		this.uninstallMonkeyPatch && this.uninstallMonkeyPatch();
	}

	async loadSettings() {
		// At first startup, `data` is `null` because data.json does not exist.
		let data = (await this.loadData()) as OpenerSetting | null;
		//Check for existing settings
		// if (data == undefined) {
		// 	data = { showedMobileNotice: true } as any;
		// }
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	monkeyPatchopenFile() {
		console.log(this.settings.PDFApp);
		let parentThis = this;
		this.uninstallMonkeyPatch = around(WorkspaceLeaf.prototype, {
			openFile(oldopenFile) {
				return async function (file: TFile, openState?: OpenViewState) {
					if (parentThis.settings.PDFApp && file.extension == "pdf") {
						// @ts-ignore
						app.openWithDefaultApp(file.path);
						return;
					}
					// if clicking on link with same path as active file in view, defer to default behavior (ie headings, blocks, etc). file.path is thing being opened. app.workspace.getActiveFile()?.path is currently opened tab filepath.
					let sameFile =
						file.path == app.workspace.getActiveFile()?.path;
					let openElsewhere = false;
					if (sameFile) {
						oldopenFile &&
							oldopenFile.apply(this, [file, openState]);
						return;
					} else if (!sameFile) {
						// else if already open in another tab, switch to that tab
						app.workspace.iterateAllLeaves(
							(leaf: WorkspaceLeaf) => {
								const viewState = leaf.getViewState();
								const matchesMarkdownFile =
									viewState.type === "markdown" &&
									viewState.state?.file?.endsWith(
										`${file.basename}.md`
									);
								const matchesNonMarkdownFile =
									viewState.type !== "markdown" &&
									viewState.state?.file?.endsWith(
										file.basename
									);

								if (
									matchesMarkdownFile ||
									matchesNonMarkdownFile
								) {
									app.workspace.setActiveLeaf(leaf, {
										focus: true,
									});
									openElsewhere = true;
									return;
								}
							}
						);
						// else open in new tab

						//default behavior but new tab
						if (!sameFile && !openElsewhere) {
							oldopenFile &&
								oldopenFile.apply(
									this.app.workspace.getLeaf("tab"),
									[file, openState]
								);
							return;
						}
					}
				};
			},
		});
	}
}
