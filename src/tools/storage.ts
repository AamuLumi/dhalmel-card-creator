import { DCC } from './types.ts';

class Storage {
	private _cardBuilder: any;
	private _devTools: any;

	constructor() {}

	init(cardBuilder: any, devTools: any) {
		this._cardBuilder = cardBuilder;
		this._devTools = devTools;

		this.loadFromStorage();
	}

	loadFromStorage = () => {
		const currentCard = window.localStorage.getItem('currentCard');

		if (this._cardBuilder && currentCard) {
			this._cardBuilder.initCardFromString(currentCard);
		}

		const devMode = window.localStorage.getItem('devMode');

		if (this._devTools && devMode) {
			this._devTools.init(devMode === 'true');
		}
	};

	saveCard = (o: DCC.Card) => {
		if (this._cardBuilder) {
			window.localStorage.setItem('currentCard', this._cardBuilder.toString(o));
		}
	};

	saveDevMode = (v: boolean) => {
		window.localStorage.setItem('devMode', String(v));
	};
}

export default new Storage();
