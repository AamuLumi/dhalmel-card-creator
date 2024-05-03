import { DCC } from './types.ts';

class Storage {
	private _cardBuilder: any;

	constructor() {}

	init(cardBuilder: any) {
		this._cardBuilder = cardBuilder;

		this.loadFromStorage();
	}

	loadFromStorage = () => {
		const currentCard = window.localStorage.getItem('currentCard');

		if (this._cardBuilder && currentCard) {
			this._cardBuilder.initCardFromString(currentCard);
		}
	};

	saveCard = (o: DCC.Card) => {
		if (this._cardBuilder) {
			window.localStorage.setItem('currentCard', this._cardBuilder.toString(o));
		}
	};
}

export default new Storage();
