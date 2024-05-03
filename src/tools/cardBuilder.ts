import { useSyncExternalStore } from 'react';
import Storage from './storage.ts';
import { DCC } from './types.ts';

const SAVE_INTERVAL = 2000;

class CardBuilder {
	private _currentCard: DCC.Card | null = null;
	private readonly _listeners: Record<DCC.CardKeys, Array<() => void>>;
	private _needSave: boolean = false;

	public setters: DCC.CardSetters = {} as any;

	constructor() {
		this._listeners = {} as any;

		this.initCard();

		setInterval(this._saveToLocalStorage, SAVE_INTERVAL);
	}

	private _saveToLocalStorage = () => {
		if (this._currentCard && this._needSave) {
			Storage.saveCard(this._currentCard);
			this._needSave = false;
		}
	};

	initCard(o: Record<string, unknown> = {}) {
		const currentCard = {
			rarity: (o.rarity ?? 'common') as DCC.Rarity,
			template: (o.template ?? 'classic') as DCC.Template,
			type: (o.type ?? 'creature') as DCC.Type,
			title: typeof o.title === 'string' ? o.title : '',
			code: typeof o.code === 'number' ? o.code : 0,
			collectionName: typeof o.collectionName === 'string' ? o.collectionName : '',
			description: typeof o.description === 'string' ? o.description : '',
			illustratorName: typeof o.illustratorName === 'string' ? o.illustratorName : '',
			image:
				typeof o.image === 'object'
					? (o.image as DCC.ArtFile)
					: typeof o.image === 'string'
					? JSON.parse(o.image)
					: null,
			credit: typeof o.credit === 'string' ? o.credit : 'Lafond Designs',
			horizontalOffset: typeof o.horizontalOffset === 'number' ? o.horizontalOffset : 0.5,
			verticalOffset: typeof o.verticalOffset === 'number' ? o.verticalOffset : 0.5,
			scale: typeof o.scale === 'number' ? o.scale : 1,
			texture: (typeof o.texture === 'string' ? o.texture : 'none') as DCC.Texture,
		};

		const createSetter = (field: DCC.CardKeys) => (o: any) => {
			(this._currentCard as any)[field as any] = o;

			this._needSave = true;
			this._notify(field);

			return this._currentCard;
		};

		this.setters = {
			setCode: createSetter('code'),
			setType: createSetter('type'),
			setTitle: createSetter('title'),
			setDescription: createSetter('description'),
			setCollectionName: createSetter('collectionName'),
			setIllustratorName: createSetter('illustratorName'),
			setCredit: createSetter('credit'),
			setRarity: createSetter('rarity'),
			setTemplate: createSetter('template'),
			setImage: createSetter('image'),
			setHorizontalOffset: createSetter('horizontalOffset'),
			setVerticalOffset: createSetter('verticalOffset'),
			setScale: createSetter('scale'),
			setTexture: createSetter('texture'),
		};

		this._currentCard = currentCard;
		this._needSave = true;

		Object.keys(this._currentCard).forEach((key: any) => {
			this._notify(key);
		});
	}

	initCardFromString(s: string) {
		try {
			this.initCard(JSON.parse(s));
		} catch {
			console.error('Invalid JSON');

			this.initCard();
		}
	}

	toString(o: DCC.Card) {
		return JSON.stringify(o);
	}

	private _notify = (event: DCC.CardKeys) => {
		if (this._listeners[event]) {
			this._listeners[event].forEach((f) => f());
		}
	};

	private _on = (event: DCC.CardKeys, fn: () => void) => {
		if (!this._listeners[event]) {
			this._listeners[event] = [];
		}

		this._listeners[event].push(fn);

		return () => {
			const index = this._listeners[event].indexOf(fn);

			if (index > -1) {
				this._listeners[event].splice(index, 1);
			}
		};
	};

	private _get = (e: DCC.CardKeys): any => {
		if (!this._currentCard) {
			return null;
		}

		return this._currentCard[e];
	};

	use = (e: DCC.CardKeys) => {
		return useSyncExternalStore(
			(fn) => this._on(e, fn),
			() => this._get(e),
		);
	};

	getCurrentCard = () => this._currentCard;
	getCurrentCardToString = () => JSON.stringify(this._currentCard);
}

export default new CardBuilder();
