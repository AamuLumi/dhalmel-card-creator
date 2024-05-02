import { useSyncExternalStore } from 'react';
import ArtFile = DCC.ArtFile;

export namespace DCC {
	export type Rarity = 'common' | 'rare' | 'epic' | 'eternal' | 'legendary' | 'mythic' | 'relic';
	export type Template = 'classic' | 'eorzean' | 'fullart' | 'clean';
	export type Type =
		| 'creature'
		| 'item'
		| 'land'
		| 'god'
		| 'action'
		| 'human'
		| 'imperial'
		| 'primordial'
		| 'scion'
		| 'ascian'
		| 'mount';
	export type ArtFile = {
		data: string;
		width: number;
		height: number;
	};
	export type Texture = 'aluminium' | 'holographic' | 'foil' | 'none';
}

type CardSetters = {
	setCode(n: number): void;
	setTitle(s: string): void;
	setType(s: string): void;
	setDescription(s: string): void;
	setCollectionName(s: string): void;
	setIllustratorName(s: string): void;
	setCredit(s: string): void;
	setRarity(s: string): void;
	setTemplate(s: string): void;
	setImage(s: ArtFile | null): void;
	setHorizontalOffset(n: number): void;
	setVerticalOffset(n: number): void;
	setScale(n: number): void;
	setTexture(s: string): void;
};

type Card = {
	code: number;
	title: string;
	type: string;
	description: string;
	collectionName: string;
	illustratorName: string;
	credit: string;
	rarity: DCC.Rarity;
	template: DCC.Template;
	texture: DCC.Texture;
	/* DataURL img */
	image: ArtFile | null;
	horizontalOffset: number;
	verticalOffset: number;
	scale: number;
};

type CardKeys = keyof Card;

class CardBuilder {
	private _currentCard: Card | null = null;
	private _listeners: Record<CardKeys, Array<() => void>>;
	public setters: CardSetters = {} as any;

	constructor() {
		this._listeners = {} as any;

		this.initCard();
	}

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
					? (o.image as ArtFile)
					: typeof o.image === 'string'
					? JSON.parse(o.image)
					: null,
			credit: typeof o.credit === 'string' ? o.credit : 'Lafond Designs',
			horizontalOffset: typeof o.horizontalOffset === 'number' ? o.horizontalOffset : 0.5,
			verticalOffset: typeof o.verticalOffset === 'number' ? o.verticalOffset : 0.5,
			scale: typeof o.scale === 'number' ? o.scale : 1,
			texture: (typeof o.texture === 'string' ? o.texture : 'none') as DCC.Texture,
		};

		const createSetter = (field: CardKeys) => (o: any) => {
			(this._currentCard as any)[field as any] = o;

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

	toString(o: Card) {
		return JSON.stringify(o);
	}

	private _notify = (event: CardKeys) => {
		if (this._listeners[event]) {
			this._listeners[event].forEach((f) => f());
		}
	};

	private _on = (event: CardKeys, fn: () => void) => {
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

	private _get = (e: CardKeys): any => {
		if (!this._currentCard) {
			return null;
		}

		return this._currentCard[e];
	};

	use = (e: CardKeys) => {
		return useSyncExternalStore(
			(fn) => this._on(e, fn),
			() => this._get(e),
		);
	};

	getCurrentCard = () => this._currentCard;
	getCurrentCardToString = () => JSON.stringify(this._currentCard);
}

export default new CardBuilder();
