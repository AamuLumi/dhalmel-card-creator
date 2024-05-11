import Storage from './storage.ts';
import Constants from './constants.ts';

class BaseDevTools {
	private _devModeEnabled: boolean = false;

	constructor() {}

	public init(enabled: boolean): void {
		this._devModeEnabled = enabled;

		if (enabled) {
			Constants.Textures.push('vhs');
			Constants.Templates.push('cursed');
		}
	}

	public isDevMode = () => this._devModeEnabled;

	public toggleDevMode = () => {
		console.log('current', this._devModeEnabled);
		this._devModeEnabled = !this._devModeEnabled;
		setTimeout(() => {
			Storage.saveDevMode(this._devModeEnabled);
			window.location.reload();
		});
	};
}

const DevToolsInstance = new BaseDevTools();

(window as any).toggleDevMode = () => {
	DevToolsInstance.toggleDevMode();
};

export default DevToolsInstance;
