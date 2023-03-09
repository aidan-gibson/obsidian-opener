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

						// TODO test diff obsid windows being open, diff file types like html (also using html viewer in obsid) etc

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
