import { PluginSettingTab, Notice, Platform, Setting } from "obsidian";
import Opener from "./main";

export class OpenerSettingTab extends PluginSettingTab {
	display(): void {
		const { containerEl } = this;
		const plugin: Opener = (this as any).plugin;
		containerEl.empty();
		new Setting(containerEl)
			.setName("PDF Default App")
			.setDesc(
				"Enable to open pdfs with default app. Disable to open pdfs in Obsidian."
			)
			.addToggle((toggle) =>
				toggle.setValue(plugin.settings.PDFApp).onChange((value) => {
					plugin.settings.PDFApp = value;
					plugin.saveSettings();
				})
			);
	}
}
