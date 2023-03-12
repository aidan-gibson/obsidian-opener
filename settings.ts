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
			.setName("Open everything outside of Obsidian")
			.setDesc(
				"Enable to open all obsidian supported extensions with system viewer instead. Disable for default behavior (open within Obsidian). Defaults supported extensions are 'png', 'webp', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'mp3', 'webm', 'wav', 'm4a', 'ogg','3gp', 'flac', 'mp4', 'ogv', 'mov', 'mkv'."
			)
			.addToggle((toggle) =>
				toggle.setValue(plugin.settings.allExt).onChange((value) => {
					plugin.settings.allExt = value;
					plugin.saveSettings();
				})
			);
		new Setting(containerEl)
			.setName("Open Outside Obsidian: Manual List")
			.setDesc("This shouldn't be necessary, but you can manually enable custom extensions here.")
			.addToggle((toggle) =>
				toggle.setValue(plugin.settings.custExt).onChange((value) => {
					plugin.settings.custExt = value;
					plugin.saveSettings();
				})
			);
		new Setting(containerEl)
			.setName("Open Outside Obsidian: Manual List")
			.setDesc("Enter extension names (without the dot, ie, just docx separated by newlines).")
			.addTextArea((textArea) => {
          textArea
              .setValue(plugin.settings.custExtList.join('\n'))
              .onChange(async (value) => {
                plugin.settings.custExtList = value.split('\n');
                plugin.saveSettings();
              });
        });
		new Setting(containerEl)
			.setName("Open Inside Obsidian: Manual List")
			.setDesc("For example, if you're using HTMLViewer plugin that lets you view HTML inside Obsidian.")
			.addToggle((toggle) =>
				toggle.setValue(plugin.settings.custExtIn).onChange((value) => {
					plugin.settings.custExtIn = value;
					plugin.saveSettings();
				})
			);
		new Setting(containerEl)
			.setName("Open Inside Obsidian: Manual List")
			.setDesc("Enter extension names (without the dot, ie, just docx separated by newlines).")
			.addTextArea((textArea) => {
          textArea
              .setValue(plugin.settings.custExtInList.join('\n'))
              .onChange(async (value) => {
                plugin.settings.custExtInList = value.split('\n');
                plugin.saveSettings();
              });
        });
	}
}
