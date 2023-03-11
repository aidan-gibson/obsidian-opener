import { PluginSettingTab, Notice, Platform, Setting } from "obsidian";
import Opener from "./main";

export class OpenerSettingTab extends PluginSettingTab {
	display(): void {
		const { containerEl } = this;
		const plugin: Opener = (this as any).plugin;
		containerEl.empty();
		new Setting(containerEl)
			.setName("New Tab Default")
			.setDesc(
				"Enable to open new files in a new tab (or existing tab, if it was previously opened). Disable for default Obsidian behavior."
			)
			.addToggle((toggle) =>
				toggle.setValue(plugin.settings.newTab).onChange((value) => {
					plugin.settings.newTab = value;
					plugin.saveSettings();
				})
			);
		new Setting(containerEl)
			.setName("PDF Default App")
			.setDesc(
				"Enable to open pdfs with system viewer app. Disable for default behavior (open pdfs in Obsidian)."
			)
			.addToggle((toggle) =>
				toggle.setValue(plugin.settings.PDFApp).onChange((value) => {
					plugin.settings.PDFApp = value;
					plugin.saveSettings();
				})
			);
		new Setting(containerEl)
			.setName("All Supported Default App")
			.setDesc(
				"Enable to open all obsidian supported extensions with system viewer instead. Disable for default behavior (open pdfs in Obsidian)."
			)
			.addToggle((toggle) =>
				toggle.setValue(plugin.settings.allExt).onChange((value) => {
					plugin.settings.allExt = value;
					plugin.saveSettings();
				})
			);
	}
}
