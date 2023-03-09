import {
	Plugin,
	App,
	OpenViewState,
	Workspace,
	WorkspaceLeaf,
	MarkdownView,
	Notice,
	TFile,
} from "obsidian";
import { around } from "monkey-around";

export default class Opener extends Plugin {
	uninstallMonkeyPatch: () => void;

	async onload() {
		this.monkeyPatchopenFile();
	}

	onunload(): void {
		this.uninstallMonkeyPatch && this.uninstallMonkeyPatch();
	}

	monkeyPatchopenFile() {
		this.uninstallMonkeyPatch = around(WorkspaceLeaf.prototype, {
			openFile(oldopenFile) {
				return async function (file: TFile, openState?: OpenViewState) {
					if (file.extension == "pdf") {
						// @ts-ignore
						app.openWithDefaultApp(file.path);
						return;
					}
					// else open in new tab (unless it's already open in another tab, then switch)
					// test diff obsid windows being open

					//default behavior
					oldopenFile && oldopenFile.apply(this, [file, openState]);
				};
			},
		});
	}
}
